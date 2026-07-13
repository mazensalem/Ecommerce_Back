const bcrypt = require('bcrypt');
const User = require('./user.model');
const AppError = require('../utils/appError.util');
const jwt = require('jsonwebtoken');


exports.checkEmail = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (user){
        return next(new AppError('This email is already register', 400));
    }
    next();
}

exports.signup = async (req, res) => {
    const {name, email, phone, password, dateOfBirth} = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({name, email, phone, password, dateOfBirth, password: hashedpassword});
    res.status(201).json({msg: 'User Created', data: user});
}

exports.login = async (req, res, next)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user.isDeleted){
        return next(new AppError("This user is not found", 404));
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({_id: user._id, email: user.email, name: user.name, phone: user.phone, role: "user"}, process.env.SECRETE_KEY, {expiresIn: process.env.TOKEN_EXPIRE});
        return res.status(200).json({"msg": "you loged in sucessfully", data: token});
    }


    next(new AppError("you entered a wrong credintials", 401));
}

exports.loginCheck = async (req, res, next) => {
    try {
        if (!req.headers.authorization){return next(new AppError("you must be logged in", 401));}
        const token = req.headers.authorization.split(' ')[1];
        const data = jwt.verify(token, process.env.SECRETE_KEY);
        const user = await User.findById(data._id);
        req.user = user;
        next();
    }catch (err){
        next(new AppError("this token is invalid or expired", 401));
    }
}

exports.profile = async (req, res, next) => {
    const userProfile = await User.findById(req.user._id);
    if (userProfile.isDeleted){
        return next(new AppError("This user is not found", 404));
    }
    res.status(200).json({msg: "profile", data: userProfile});
}

exports.editprofile = async (req, res, next) => {
    try {
        const id = req.user._id;
        const { name, email, phone, dateOfBirth } = req.body;
        const user = await User.findByIdAndUpdate(id, {name, phone, dateOfBirth}, {returnDocument: 'after'});
        res.status(200).json({msg: "user updated", data: user});
    } catch (err) {
        next(new AppError("this data is not valid", 400));
    }
}

exports.changePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id);

    if (await bcrypt.compare(oldPassword, user.password)){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(user._id, {password: hashedPassword}, {returnDocument: "after"});
        res.status(200).json({msg: "password updated", data: user});
    }else{
        next(new AppError("The old password is not correct", 401));
    }

}

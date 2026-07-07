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
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({_id: user._id, email: user.email, name: user.name, phone: user.phone}, process.env.SECRETE_KEY, {expiresIn: process.env.TOKEN_EXPIRE});
        return res.status(200).json({"msg": "you loged in sucessfully", data: token});
    }

    next(new AppError("you entered a wrong credintials", 401));
}

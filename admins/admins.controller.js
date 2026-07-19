const Admin = require('./admins.modle');
const AppError = require('../utils/appError.util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.isAdminLoggedIn = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header){ return next(new AppError("you must login first", 401)); }
    
    const token = header.split(' ')[1];
    if (!token){ return next(new AppError("you must login first", 401)); }

    try {
        jwt.verify(token, process.env.SECRETE_KEY);
        req.user = jwt.decode(token);
        if (req.user.role != 'admin'){ return next(new AppError("you must login first", 401)); }

        next();
    }catch (err){
        next(new AppError("you must login first", 401));
    }
}

exports.adminLogin = async (req, res, next) => {
    const {email, password} = req.body;

    const user = await Admin.findOne({email});
    if (!user || user.isDeleted){ return next(new AppError("these cradentials are not valid", 401)); }
    
    if (await bcrypt.compare(password, user.password)){
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'admin'
        }, process.env.SECRETE_KEY);
        res.status(200).json({msg: "Success", data: token});
    }else{
        res.status(401).json({msg: "Failed", data: null});
    }
}


exports.addAdmin = async (req, res) => {
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({email, name, password: hashedPassword});

    res.status(201).json({"msg": "admin created", data: admin});
}

exports.getAllAdmins = async (req, res) => {
    const admins = await Admin.find({isDeleted: false});
    res.status(200).json({"msg": admins.length, data: admins});
}


exports.editAdmin = async (req, res) => {
    const {name} = req.body;
    const id = req.user._id;
    const admin = await Admin.findByIdAndUpdate(id, {name}, {returnDocument: 'after'});

    res.status(200).json({"msg": "updated", data: admin});
}


exports.deleteAdmin = async (req, res, next) => {
    const id = req.params.id;
    const admin = await Admin.findByIdAndUpdate(id, {isDeleted: true});
    res.status(200).json({msg: 'deleted done', data: null});
}

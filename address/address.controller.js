const AppError = require('../utils/appError.util');
const Address = require('./address.model');
const mongoose = require('mongoose');

exports.getAddress = async (req, res) => {
    const addresses = await Address.find({user: req.user._id, isDeleted: false});
    res.status(200).json({"msg": "adderses returned", data: addresses});
}

exports.createAddress = async (req, res) => {
    const {title, address, phone, isDefault} = req.body;
    if (isDefault) {await Address.findOneAndUpdate({user: req.user._id, isDefault: true}, {isDefault: false});}
    const userAddress = await Address.create({title, address, phone, isDefault, user: req.user._id});
    res.status(201).json({msg: "address created", data: userAddress});
}

exports.getDefaultAddress = async (req, res, next) => {
    const addresse = await Address.findOne({user: req.user._id, isDefault: true});
    if (!addresse || addresse.isDeleted){
        return next(new AppError("no address found", 404));
    }
    res.status(200).json({"msg": "adderses returned", data: addresse});
}

exports.getSingleAddress = async (req, res, next) => {
    try {
        const id = req.params.id;
        const address = await Address.findById(id);
        if (!address || address.isDeleted || req.user._id.toString() != address.user.toString()){
            throw new Error("");    
        }
        res.status(200).json({"msg": "found address", data: address});
    }catch (Err){
        next(new AppError("This address was not found", 404));
    }
}

exports.updateAddresss = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const id = req.params.id;
        const {title, address, phone, isDefault} = req.body;
        if (isDefault){await Address.findOneAndUpdate({user: req.user._id, isDefault: true}, {isDefault: false}, {session});}
        const userAddress = await Address.findOneAndUpdate({_id: id, user: req.user._id, isDeleted: false}, {title, address, phone, isDefault}, {returnDocument: "after", session});
        await session.commitTransaction();
        await session.endSession();
        res.status(200).json({msg: "address updated", data: userAddress});
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        next(new AppError("This product was not found", 404));
    }
}

exports.deleteAddress = async (req, res, next) => {
    const id = req.params.id;
    try{
        await Address.findOneAndUpdate({_id: id, user: req.user._id, isDeleted: false}, {isDeleted: true});
        res.status(200).json({msg: "Address deleted"});
    }catch (err){
        next(new AppError("Product not found"), 404);
    }
}

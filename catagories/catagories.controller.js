const Catagory = require('./catagories.model');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError.util');

exports.getAllCatagories = async (req, res) => {
    const catagories = await Catagory.find({isDeleted: false});
    res.status(200).json({msg: 'catagories', data: catagories});
} 

exports.getCatagories = async  (req, res) => {
    const catagories = await Catagory.find({isDeleted: false, isActive: true});
    res.status(200).json({msg: 'catagories', data: catagories});
}

exports.getOneCatagory = async (req, res, next) => {
    const id = req.params.id;
    const catagory = await Catagory.findById(id);
    if (!catagory){
        return next(new AppError("this Catagory wasn't found", 404));
    }
    res.status(200).json({msg: 'catagory', data: catagory});
}

exports.createCatagory = async (req, res) => {
    const {name, slug, isActive} = req.body;
    const imgUrl = req.file ? req.file.filename : null;
    const catagory = await Catagory.create({name, slug, isActive, imgUrl});
    res.status(201).json({msg: "catagory created", data: catagory});
}

exports.editCatagory = async (req, res, next) => {
    const id = req.params.id;
    const {name, slug, isActive} = req.body;
    
    const oldCatagory = await Catagory.findById(id);
    if (!oldCatagory){
        return next(new AppError('this catagory doesn\'t exists', 404));
    }

    if (req.file) {
        const imgUrl = req.file.filename;
        const catagory = await Catagory.findByIdAndUpdate(id, {name, slug, isActive, imgUrl}, {returnDocument: 'after'});
        await fs.promises.rm(path.join(__dirname, '../uploads', oldCatagory.imgUrl));
        return res.status(200).json({msg: "Catagory updated", data: catagory});
    }

    const catagory = await Catagory.findByIdAndUpdate(id, {name, slug, isActive}, {returnDocument: 'after'});
    res.status(200).json(catagory);
}

exports.deleteCatagory = async (req, res, next) => {
    const id = req.params.id;

    const oldCatagory = await Catagory.findById(id);
    if (!oldCatagory){
        return next(new AppError('this catagory doesn\'t exists', 404));
    }

    const catagory = await Catagory.findByIdAndUpdate(id, {isDeleted: true}, {returnDocument: 'after'});
    await fs.promises.rm(path.join(__dirname, '../uploads', oldCatagory.imgUrl));
    res.status(200).json({msg: "deleted", data: null});

}
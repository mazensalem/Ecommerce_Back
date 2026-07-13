const SubCatagory = require('./subcatagories.modle');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError.util');

exports.getAllSubCatagories = async (req, res) => {
    const subcatagories = await SubCatagory.find({isDeleted: false});
    res.status(200).json({msg: 'subcatagories', data: subcatagories});
}

exports.getSubCatagories = async (req, res) => {
    const subcatagories = await SubCatagory.find({isDeleted: false, isActive: true});
    res.status(200).json({msg: 'subcatagories', data: subcatagories});
}

exports.getOneSubCatagory = async (req, res) => {
    const id = req.params.id;
    const subCatagory = await SubCatagory.findById(id);
    res.status(200).json({msg: 'subcatagory', data: subCatagory});
}

exports.createSubCatagory = async (req, res) => {
    const {name, slug, catagoryId, isActive} = req.body;
    const imgUrl = req.file.filename;
    const subcatagory = await SubCatagory.create({name, slug, catagoryId, isActive, imgUrl});
    res.status(201).json({msg: 'subcatagory created', data: subcatagory});
}

exports.editSubCatagory = async (req, res, next) => {
    const id = req.params.id;
    const {name, slug, catagoryId, isActive} = req.body;
    if (req.file) {
        const newFileName = req.file.filename;
        const oldCatagory = await SubCatagory.findById(id);
        if (!oldCatagory){ return next(new AppError("This catagory is not found", 404)); }
        const oldFileName = oldCatagory.imgUrl;

        const subCatagory = await SubCatagory.findByIdAndUpdate(id, {name, slug, catagoryId, isActive, imgUrl: newFileName}, {returnDocument: 'after'});
        await fs.promises.rm(path.join(__dirname, '../uploads', oldFileName));
        return res.status(200).json({msg: "edited", data: subCatagory});
    }

    const subCatagory = await SubCatagory.findByIdAndUpdate(id, {name, slug, catagoryId, isActive}, {returnDocument: 'after'});
    res.status(200).json({msg: "edited", data: subCatagory});

}


exports.deleteSubCatagory = async (req, res, next) => {
    const id = req.params.id;
    const subCatagory = await SubCatagory.findByIdAndUpdate(id, {isDeleted: true});
    if (!subCatagory){return next(new AppError("This sub catagory is not found", 404));}
    await fs.promises.rm(path.join(__dirname, '../uploads', subCatagory.imgUrl));
    res.status(200).json({msg: "deleted", data: null});
}

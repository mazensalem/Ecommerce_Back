const Catagory = require('./catagories.model');
const fs = require('fs');
const path = require('path');
const AppError = require('../utils/appError.util');

exports.getAllCatagories = async (req, res) => {

    const result = await Catagory.aggregate([
        {$match: {isDeleted: false}},
        {
            // 1. Join with SubCategories
            $lookup: {
                from: 'subcatagories', // The collection name in MongoDB
                pipeline: [{
                    $match: {
                        'isDeleted': false
                    }
                }],
                localField: '_id',
                foreignField: 'catagoryId',
                as: 'subCategories'
            }
        },
        {
            // 2. Unwind to handle subcategories individually
            $unwind: { path: '$subCategories', preserveNullAndEmptyArrays: true }
        },
        {
            // 3. Join with Products based on both Category and SubCategory
            $lookup: {
                from: 'products',
                let: { catId: '$_id', subCatId: '$subCategories._id' },
                pipeline: [
                    {
                    $match: {
                        $expr: {
                        $and: [
                            { $eq: ['$catagory', '$$catId'] },
                            { $eq: ['$subCatagory', '$$subCatId'] }
                        ]
                        }
                    }
                    }
                ],
                as: 'products'
            }
        },
        {
            // 4. Add a field for the product count
            $addFields: {
            'subCategories.productCount': { $size: '$products' }
            }
        },
        {
            // 5. Group back to structure the data properly
            $group: {
            _id: '$_id',
            name: { $first: '$name' },
            imgUrl: { $first: '$imgUrl' },
            slug: { $first: '$slug' },
            isActive: {$first: '$isActive'},
            subCategories: { $push: '$subCategories' }
            }
        },
    ]);

    const catagories = await Catagory.find({isDeleted: false});
    res.status(200).json({msg: 'catagories', data: result});
} 

exports.getCatagories = async  (req, res) => {
    const catagories = await Catagory.aggregate([
        {
            $lookup: {
                from: 'products',
                foreignField: 'catagory',
                localField: '_id',
                as: 'products'
            },
        },
        {
            $project: {
                name: 1,
                imgUrl: 1,
                slug: 1,
                isActive: 1,
                isDeleted: 1,
                productCount: { $size: "$products" }
            }
        }
    ])

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

    const catagory = await Catagory.findByIdAndUpdate(id, {isDeleted: true, slug: Date.now()}, {returnDocument: 'after'});
    await fs.promises.rm(path.join(__dirname, '../uploads', oldCatagory.imgUrl));
    res.status(200).json({msg: "deleted", data: null});

}
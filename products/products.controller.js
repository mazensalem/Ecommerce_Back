const Product = require('./products.model');
const AppError = require('../utils/appError.util');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
    const productsPerPage = 10;
    const {page, active, category} = req.query;
    const filters = {isDeleted: false};
    
    if (category && category != 'ALL') {filters['catagory'] = category;}
    if (active &&  active != 0) {filters['isActive'] = (active > 0);}
    

    const products = await Product.find(filters)
    .populate(['catagory', 'subCatagory'])
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);
    
    const totalProductsCount = await Product.aggregate([
        {
            $group: {
                _id: null,
                count: {$sum: 1}
            }
        }
    ]);

    res.status(200).json({msg: `${totalProductsCount[0].count}`, data: products});
}

exports.searchProducts = async (req, res) => {
    const {search, catagory, subCatagory, priceMin, priceMax} = req.query;
    const fileter = {isDeleted: false, isActive: true};
    if (priceMin !== undefined || priceMax !== undefined){fileter['price'] = {}}

    if (search) {fileter['title'] = {$regex: search};}
    if (catagory) {fileter['catagory'] = catagory;}
    if (subCatagory) {fileter['subCatagory'] = subCatagory;}
    if (priceMin) {fileter['price']['$gte'] = priceMin;}
    if (priceMax) {fileter['price']['$lte'] = priceMax;}

    const products = await Product.find(fileter);
    res.status(200).json({msg: products.length, data: products});
}

exports.bestSeller = async (req, res) => {
    const products = await Product.find({isActive: true, isDeleted: false, mostPopular: true}).populate(['subCatagory', 'catagory'])
    
    res.status(200).json({msg: 'popular products', data: products});
}

exports.getProduct = async (req, res, next) => {
    const slug = req.params.slug;
    const product = await Product.findOne({slug}).populate(['catagory', 'subCatagory']);
    if (!product) {
        return next(new AppError("this product is not found", 404));
    }
    res.status(200).json({msg: "product found", data: product});
}


exports.addProduct = async (req, res) => {
    const {title, desc, price, stock, slug, newArrivals, mostPopular, catagory, subCatagory, isActive} = req.body;
    const imgUrl = req.file.filename;

    const product = await Product.create({title, desc, price, imgUrl, stock, slug, newArrivals, mostPopular, catagory, subCatagory, isActive});
    res.status(201).json({msg: "product created", data: product});
}


exports.editProduct = async (req, res, next) => {
    const id = req.params.id;
    const {title, desc, price, stock, slug, newArrivals, mostPopular, catagory, subCatagory} = req.body;
    
    const oldProduct = await Product.findById(id);
    if (!oldProduct){ return next(new AppError('Product not found', 404)); }
    const oldFileName = oldProduct.imgUrl;

    const newProductData = {title, desc, price, stock, slug, newArrivals, mostPopular, catagory, subCatagory};
    if (req.file){
        newProductData['imgUrl'] = req.file.filename; // if the img is provided, change it in the database
    }

    const product = await Product.findByIdAndUpdate(id, newProductData, {returnDocument: 'after'});
    
    if (req.file){ 
        await fs.promises.rm(path.join(__dirname, '../uploads', oldFileName));  // if the img is reuploaded delete the old
    }

    res.status(200).json({msg: "product edited", data: product});
}


exports.setNewArrivals = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, {newArrivals: true}, {returnDocument: 'after'});
    res.status(200).json({msg: "Product set", data: product});
}


exports.setMostPopular = async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, {mostPopular: true}, {returnDocument: 'after'});
    res.status(200).json({msg: "Product set", data: product});
}


exports.deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    
    const oldProduct = await Product.findById(id);
    if (!oldProduct){ return next(new AppError('Product not found', 404)); } 

    const product = await Product.findByIdAndUpdate(id, {isDeleted: true, isActive: false});
    await fs.promises.rm(path.join(__dirname, '../uploads', oldProduct.imgUrl));

    res.status(200).json({msg: "product deleted", data: null});
}

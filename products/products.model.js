const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    imgUrl: {type: String, required: true},
    stock: {type: Number, required: true},
    slug: {type: String, required: true, unqiue: true},
    newArrivals: {type: Boolean, default: false},
    mostPopular: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    catagory: {
        type: mongoose.Types.ObjectId,
        ref: 'catagories',
        required: true
    },
    subCatagory: {
        type: mongoose.Types.ObjectId,
        ref: 'subcatagories',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('product', productSchema);

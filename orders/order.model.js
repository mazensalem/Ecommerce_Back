const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
    status: {type: String, requried: true, default: 'Pendding', enum: ['Pendding', 'Preparing', 'Shipped', 'Recieved', 'Rejected', 'Canceled by admin', 'Canceled by user']},
    products: [{
        productId: {type: mongoose.Types.ObjectId, ref: 'product'},
        pricePerUnit: {type: Number, min: 0},
        quantity: {type: Number, min: 1}
    }],
    address: {type: {phone: String, address: String}}
}, {timestamps: true});

module.exports = mongoose.model('order', orderSchema);

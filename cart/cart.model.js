const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'user', required: true, unique: true},
    products: [{
        productId: {type: mongoose.Types.ObjectId, ref: 'product'},
        pricePerUnit: {type: Number, min: 0},
        quantity: {type: Number, min: 1}
    }]
})

module.exports = mongoose.model('cart', cartSchema);

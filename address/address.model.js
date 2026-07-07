const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    title: {type: String, required: true},
    address: {type: String, required: true},
    phone: {type: String, required: true, match: /^01\d{9}$/},
    user: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
    isDeleted: {type: Boolean, required: true, default: false},
    isDefault: {type: Boolean, required: true, default: false}
}, {timestamps: true});

module.exports = mongoose.model('address', addressSchema);

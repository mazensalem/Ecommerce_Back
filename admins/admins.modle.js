const mongoose = require('mongoose');

const adminsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isDeleted: {type: Boolean, default: false, required: true},
}, {timestamps: true});

module.exports = mongoose.model('admin', adminsSchema);

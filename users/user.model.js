const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, match: /^01\d{9}$/, required: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    isDeleted: {type: Boolean, default: false, required: true},
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);

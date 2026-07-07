const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    joinedAt: {type: Date, default: Date.now(), required: true}
});

module.exports = mongoose.model('user', userSchema);

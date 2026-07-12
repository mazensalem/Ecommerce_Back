const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    imgUrl: {type: String, required: true},
    slug: {type: String, require: true, unique: true},
    isActive: {type: Boolean, require: true, default: true},
    isDeleted: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('catagories', catagorySchema);
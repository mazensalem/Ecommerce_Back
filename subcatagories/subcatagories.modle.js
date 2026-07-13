const mongoose = require('mongoose');

const subCatagoriesSchema = new mongoose.Schema({
    catagoryId: {type: mongoose.Types.ObjectId, required: true, ref: 'catagories'},
    name: {type: String, required: true},
    imgUrl: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    isActive: {type: Boolean, required: true, default: true},
    isDeleted: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('subcatagories', subCatagoriesSchema);

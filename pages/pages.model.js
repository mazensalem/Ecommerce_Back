const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    active: {type: Boolean, required: true, default: true},
    deleted: {type: Boolean, required: true, default: false}
});

const testimonialSchema = new mongoose.Schema({
    text: {type: String, required: true},
    ratting: {type: Number, required: true, min: 0, max: 5},
    user: {type: String, required: true},
    status: {type: String, default: 'pendding', enum: ['pendding', 'approved', 'canceld']}
});

module.exports = {
    pages: mongoose.model('page', pageSchema),
    testimonial: mongoose.model('testimonial', testimonialSchema)
}
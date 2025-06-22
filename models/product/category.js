const mongoose = require('mongoose')

const cateSchema = new mongoose.Schema({
    name: String,
    image:[String],

}, {timestamps: true},)

const Category = mongoose.model('Category', cateSchema)

module.exports = Category;
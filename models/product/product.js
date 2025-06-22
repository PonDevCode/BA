const mongoose = require('mongoose')
const { Schema } = mongoose;
const productSchema = new mongoose.Schema(
    {
        name: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        price: String,
        priceSale: String,
        description: String,
        image: [String]
    },
    {timestamps: true},
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product;
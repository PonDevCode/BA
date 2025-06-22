const mongoose = require('mongoose');
const {Schema} = mongoose;

const productVariantSchema = new mongoose.Schema(
    {
        productVariant: {
            type: Schema.Types.ObjectId,
            ref:'Product',
            require: true
        },
        quantity: {type: Number , default: 1},
        note: String
    },
    {timestamps: true}
)

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema)

module.exports = ProductVariant
const mongoose = require('mongoose');
const {Schema} = mongoose;

const productVariantSchema = new mongoose.Schema(
    {
        size: String,
        price: String,
        product: {
            type: Schema.Types.ObjectId,
            ref:'Product',
            require: true
        },
        stock: {type:Number,default: 0} // không có giá trị tự gán = 0
    },
    {timestamps: true}
)

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema)

module.exports = ProductVariant
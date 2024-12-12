const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title Required!'],
        min: 3,
        max: 18,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product Price Required'],
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    imagePath: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Mobile', 'Laptop',],
    },
    inStock: {
        type: Boolean,
        defualt: true,
        select: true,
    },
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
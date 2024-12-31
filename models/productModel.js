const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number,
    },
    description: {
        type: String
    },
    brand: {
        type: String
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String
    },
    inStock: {
        type: Boolean,
        defualt: true
    },
    discount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
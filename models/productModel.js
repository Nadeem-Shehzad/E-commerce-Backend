const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Product name Required!'],
        min: 3,
        max: 18 
    },
    price: {
        type: Number,
        required: [true,'Product Price Required']
    },
    quantity: {
        type: Number,
        required: true
    } 
});

const productModel = mongoose.model('Product',productSchema);

module.exports = productModel;
const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    },
    totalPrice:{
        type: Number
    }
}, { timestamps: true });


const cartModel = mongoose.model('Cart', cartSchema);
module.exports = cartModel;
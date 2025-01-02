const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const wishlistSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    productId: {
        type: ObjectId,
        ref: 'Product'
    },
}, { timestamps: true });

const model = mongoose.model('WishList', wishlistSchema);
module.exports = model;
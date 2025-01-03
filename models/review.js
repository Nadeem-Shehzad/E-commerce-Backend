const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ReviewSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    productId: {
        type: ObjectId,
        ref: 'Product'
    },
    rating: {
        type: Number,
    },
    comment: {
        type: String,
        max: 50,
        default: ''
    },

}, { timestamps: true })


module.exports = mongoose.model("Review", ReviewSchema)
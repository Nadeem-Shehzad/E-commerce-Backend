const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const productSchema = new Schema({
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
    category: {
        type: String
    },
    image: {
        public_id: { // needs public_id to delete it from cloudinary
            type: String,
            required: [true,'image public_id missing!']
        },
        url: {
            type: String,
            required: [true,'image url missing!']       
        }
    },
    reviews: {
        type: [{
            rating: Number,
            ratedBy: ObjectId,
            comment: String
        }],
        default: []
    },
    rating: {
        type: Number,
        default: 0
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
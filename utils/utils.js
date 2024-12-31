const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Product = require('../models/productModel');


const checkAdminAccess = asyncHandler(async (req, res) => {
    const user = await User.findUser(req.user.email);

    if (!user.isAdmin) {
        res.status(403);
        throw new Error('Access Denied!');
    }
});


const checkProductExists = asyncHandler(async (req, res) => {
    const productID = req.params._id;

    const product = await Product.findById(productID);
    if (!product) {
        res.status(404);
        throw new Error('Product not Found!');
    }
});


// custom error function
const errorMsg = (errors) => {
    const fieldName = errors.array()[0].path;
    const errorMsg = errors.array()[0].msg;
    const error = `${fieldName}: ${errorMsg}`;

    return error;
}


module.exports = {
    checkAdminAccess,
    checkProductExists,
    errorMsg
}
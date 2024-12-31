const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

//@desc Get all products
//@route GET /api/admin/product
//@access Public
const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await Product.find({});
    res.status(200).json({success: true, message: 'All Products Data', data: allProducts});
});


//@desc Get single product
//@route GET /api/admin/product/:id
//@access Public
const getSingleProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Single Product` });
});


//@desc search product
//@route GET /api/admin/product/search
//@access Public
const searchProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Search Product` });
});



module.exports = {
    getAllProducts,
    getSingleProduct,
    searchProduct
}
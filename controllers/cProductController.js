const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');


//@desc Get all products
//@route GET /api/admin/product
//@access Public
const getAllProducts = asyncHandler(async (req, res) => {

    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    if (Object.keys(req.query).length !== 0) {
        if (req.query.brand) {
            const brandData = await Product.find({ brand: req.query.brand })
                .skip((page - 1) * dataLimit).limit(dataLimit);

            res.status(200).json({ success: true, message: 'Brand Data', data: brandData, total: brandData.length });

        } else if (req.query.category) {
            const categoryData = await Product.find({ category: req.query.category })
                .skip((page - 1) * dataLimit).limit(dataLimit);

            res.status(200).json({ success: true, message: 'Category Data', data: categoryData, total: categoryData.length });

        } else {
            res.status(404);
            throw new Error('Error. you can only search brand and category!')
        }

    } else {
        const allProducts = await Product.find({}).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Page ${page} Products Data`, data: allProducts, total: allProducts.length });
    }
});


//@desc Get single product
//@route GET /api/admin/product/:_id
//@access Public
const getSingleProduct = asyncHandler(async (req, res) => {
    const productID = req.params._id;

    const product = await Product.findOne({ _id: productID });
    if (!product) {
        res.status(404);
        throw new Error('Product not Found!');
    }

    res.status(200).json({ success: true, message: `Product Details`, data: product });
});


//@desc Get products by category
//@route GET /api/admin/product/category
//@access Private
const getProductsByCategory = asyncHandler(async (req, res) => {

    const { categoryType } = req.body;
    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    if (categoryType === 'all') {
        const products = await Product.find({}).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Product Details`, data: products, total: products.length });

    } else if (categoryType === 'pricelowtohigh') {
        const products = await Product.find({}).sort({ price: 1 }).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Price low to high`, data: products, total: products.length });

    } else if (categoryType === 'pricehightolow') {
        const products = await Product.find({}).sort({ price: -1 }).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Price high to low`, data: products, total: products.length });

    } else if (categoryType === 'highrated') {
        const products = await Product.find({}).sort({ rating: -1 }).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Rating High to Low`, data: products, total: products.length });

    } else if (categoryType === 'lowrated') {
        const products = await Product.find({}).sort({ rating: 1 }).skip((page - 1) * dataLimit).limit(dataLimit);
        res.status(200).json({ success: true, message: `Rating Low to High`, data: products, total: products.length });

    } else {
        res.status(400);
        throw new Error('Invalid Category Type');
    }

});


//@desc search product
//@route GET /api/admin/product/search
//@access Public
const searchProduct = asyncHandler(async (req, res) => {

    const searchKey = req.body.search;

    const data = await Product.find({
        '$or': [
            { 'name': { $regex: searchKey, $options: 'i' } },
            { 'brand': { $regex: searchKey, $options: 'i' } },
            { 'category': { $regex: searchKey, $options: 'i' } },
        ]
    });
    // if want to search on entering any single letter either at start or at end  $regex: ".*" + searchKey + ".*"

    res.status(200).json({ success: true, message: 'Product Details', data: data });
});



module.exports = {
    getAllProducts,
    getSingleProduct,
    getProductsByCategory,
    searchProduct
}
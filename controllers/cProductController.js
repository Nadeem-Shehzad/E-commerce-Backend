const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { options } = require('../routes/cProductRoutes');

//@desc Get all products
//@route GET /api/admin/product
//@access Public
const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await Product.find({});
    res.status(200).json({ success: true, message: 'All Products Data', data: allProducts });
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


//@desc search product
//@route GET /api/admin/product/search
//@access Public
const searchProduct = asyncHandler(async (req, res) => {

    const search = req.body.search;
    const productData = await Product.find({ 
        "name": { 
            $regex: ".*" + search + ".*", 
            $options: "i" 
        }
    });

    if (productData.length > 0) {
        res.status(200).json({ success: true, message: 'Product Details', data: productData });
    } else {
        res.status(200).json({ success: true, message: 'Product not Found!' });
    }
});



module.exports = {
    getAllProducts,
    getSingleProduct,
    searchProduct
}
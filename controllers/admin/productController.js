const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');

//@desc Get all products
//@route GET /api/admin/product
//@access Public
const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await Product.find({});
    res.status(200).json(allProducts);
});


//@desc Get single product
//@route GET /api/admin/product/:id
//@access Public
const getSingleProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Admin Single Product` });
});


//@desc search product
//@route GET /api/admin/product/search
//@access Public
const searchProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Admin Search Product` });
});


//@desc Add products
//@route POST /api/admin/product
//@access Public
const addProduct = asyncHandler(async (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
        res.status(400);
        throw new Error('All Fields are mendatory !');
    }

    const product = await Product.create({
        name,
        price,
        quantity
    });

    res.status(201).json(product);
});


//@desc Update Product
//@route PUT /api/admin/product/:id
//@access Public
const updateProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Update Product` });
});


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Public
const deleteProduct = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `Delete Product` });
});



module.exports = {
    getAllProducts,
    getSingleProduct,
    searchProduct,
    addProduct,
    updateProduct,
    deleteProduct
}
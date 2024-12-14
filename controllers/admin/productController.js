const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');


//@desc Add products
//@route POST /api/admin/product
//@access Public
const addProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, imagePath, category, inStock } = req.body;
    if (!title || !price || !description || !brand || !imagePath || !category) {
        res.status(400);
        throw new Error('All Fields are mendatory !');
    }

    const product = await Product.create({
        title,
        price,
        description,
        brand,
        imagePath,
        category,
        inStock
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
    addProduct,
    updateProduct,
    deleteProduct
}
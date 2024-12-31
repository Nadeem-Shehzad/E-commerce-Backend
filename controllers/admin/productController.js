const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const {
    checkAdminAccess,
    checkProductExists,
    errorMsg
} = require('../../utils/utils')


//setup cloudinary to store images in cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


//@desc Add products
//@route POST /api/admin/add-product
//@access Private
const addProduct = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errorMsg(errors));
    }

    const { name, price, description, brand, category, inStock, discount } = req.body;

    let imageUploadResult = '';
    if (req.files && req.files.image) {
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        if (result && result.secure_url) {
            imageUploadResult = result.secure_url;
        }
    }

    const product = await Product.create({
        name,
        price,
        description,
        brand,
        image: imageUploadResult,
        category,
        inStock,
        discount
    });

    res.status(201).json({ success: true, message: 'Product Added.', data: product });
});


//@desc Update Product
//@route PUT /api/admin/product/:id
//@access Private
const updateProduct = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    await checkProductExists(req, res);

    const updatedProductData = await Product.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
    );

    res.status(201).json({ success: true, message: `Product Updated`, data: updatedProductData });
});


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Private
const deleteProduct = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    await checkProductExists(req, res);

    const deletedProductData = await Product.findByIdAndDelete(req.params._id);

    res.status(201).json({ success: true, message: `Product Deleted`, data: deletedProductData });
});



module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
}
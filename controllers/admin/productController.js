const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const Product = require('../../models/productModel');


//setup cloudinary to store images in cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


//@desc Add products
//@route POST /api/admin/add-product
//@access Public
const addProduct = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errorMsg(errors));
    }

    const { name, price, description, brand, category, inStock, discount } = req.body;

    let imageUploadResult = '';
    if (req.files && req.files.image) {
        //upload image to cloudinary server
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        // check image is uploaded successfully or not
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


// custom error function
const errorMsg = (errors) => {
    const fieldName = errors.array()[0].path;
    const errorMsg = errors.array()[0].msg;
    const error = `${fieldName}: ${errorMsg}`;

    return error;
}


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
}
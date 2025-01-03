const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Cart = require('../../models/cart');
const Wishlist = require('../../models/wishlist');


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

    if (req.files && req.files.image) {
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        if (result && result.secure_url) {

            // calculate discount from total price
            const totalDiscount = price / 100 * discount;
            const discountedPrice = price - totalDiscount;

            const product = await Product.create({
                name,
                price: discountedPrice,
                description,
                brand,
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                category,
                inStock,
                discount
            });

            res.status(201).json({ success: true, message: 'Product Added.', data: product });
        }
    } else {
        res.status(400);
        throw new Error('Error. Image not save or other data missing!');
    }

});


//@desc Update Product
//@route PUT /api/admin/product/:id
//@access Private
const updateProduct = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    const product = await checkProductExists(req, res);

    const newData = req.body;

    if (req.files && req.files.image) {
        const file = req.files.image;
        const imageUploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        const imageObject = {
            image: {
                public_id: imageUploadResult.public_id,
                url: imageUploadResult.secure_url
            }
        }

        Object.assign(newData, imageObject);

        // delete old image
        const imageId = product.image.public_id;
        await cloudinary.uploader.destroy(imageId, {
            resource_type: 'auto',
            invalidate: true
        })
    }

    let discountObj = {};
    if ('discount' in newData) {
        const { discount } = req.body;
        const totalDiscount = product.price / 100 * discount;
        const discountedPrice = product.price - totalDiscount;

        Object.assign(discountObj, { price: discountedPrice });
    }

    Object.assign(newData, discountObj);

    const updatedData = await Product.findByIdAndUpdate(
        req.params._id,
        newData,
        { new: true }
    );

    res.status(201).json({ success: true, message: `Product Updated`, data: updatedData });
});


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Private
const deleteProduct = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    const productID = req.params._id;
    const product = await Product.findById(productID);
    if (!product) {
        res.status(404);
        throw new Error('Product not Found!');
    }

    const imageId = product.image.public_id;

    // delete image from cloudinary
    await cloudinary.uploader.destroy(
        imageId,
        { resource_type: "auto", invalidate: true }
    );

    const deletedProductData = await Product.findByIdAndDelete(productID);

    res.status(201).json({ success: true, message: `Product Deleted`, data: deletedProductData });
});


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Private
const cartProducts = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    const cartProducts = await Cart.find({}).skip((page - 1) * dataLimit).limit(dataLimit);

    res.status(201).json({ success: true, message: `All Cart Products`, data: cartProducts });
});


//@desc Delete product
//@route DELETE /api/admin/product/:id
//@access Private
const wishlistProducts = asyncHandler(async (req, res) => {

    await checkAdminAccess(req, res);

    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    const wishlistProducts = await Wishlist.find({}).skip((page - 1) * dataLimit).limit(dataLimit);

    res.status(201).json({ success: true, message: `All Wishlist Products`, data: wishlistProducts });
});




module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    cartProducts,
    wishlistProducts
}
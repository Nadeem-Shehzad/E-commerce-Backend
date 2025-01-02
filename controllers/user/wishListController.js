const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');
const Wishlist = require('../../models/wishlist');
const { checkProductExists } = require('../../utils/utils')



//@desc All wishlist products
//@route GET /api/user/product/wishlist
//@access Private
const allWishlistProducts = async (req, res) => {

    try {
        const page = parseInt(req.body.page) || 1;
        const dataLimit = parseInt(req.body.limit) || 2;

        const wishlistItems = await Wishlist.find({ user: req.user.id }).skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(200).json({ success: true, message: `All wishlist products`, data: wishlistItems });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products from wishlist',
            error: error.message
        });
    }
};


//@desc Add product to Wishlist
//@route POST /api/user/product/wishlist
//@access Private
const addToWishList = async (req, res) => {
    try {
        const productId = req.params._id;

        const productExists = await Wishlist.findOne({ $and: [{ productId: productId }, { user: req.user.id }] });
        if (productExists) {
            res.status(403);
            throw new Error('Product already exists!');
        }

        await checkProductExists(req, res);

        const product = await Wishlist.create({
            user: req.user.id,
            productId
        });

        res.status(200).json({ success: true, message: `Product added to wishlist`, data: product });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while adding product to wishlist',
            error: error.message
        });
    }
};


//@desc Remove product from Wishlist
//@route DELETE /api/user/product/wishlist/:id
//@access Private
const removeFromWishList = async(req, res) => {
    try{
        const productId = req.params._id;
        const product = await Wishlist.findById(productId);
    
        if(!product){
            res.status(404);
            throw new Error('Product not found!');
        }
    
        if(product.user.toString() === req.user.id){
            const deletedWishlist = await Wishlist.findByIdAndDelete(productId);
            res.status(200).json({success:true, message: `Remove from wishlist`, data: deletedWishlist});
        
        } else {
            res.status(403);
            throw new Error(`Sorry! you Can't delete others wishlist items.`);
        }

    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product form wishlist',
            error: error.message
        });
    }
};


module.exports = {
    allWishlistProducts,
    addToWishList,
    removeFromWishList
}
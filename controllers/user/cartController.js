const asyncHandler = require('express-async-handler');
const Cart = require('../../models/cart');




//@desc Get all cart products
//@route GET /api/user/product/cart
//@access Public
const allCartProducts = asyncHandler(async (req, res) => {
    res.status(200).json({ message: `all cart products` });
});


//@desc Add product to cart
//@route POST /api/user/product/cart/:id
//@access Public
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = req.user.id;
    const totalPrice = 200;

    const cartItem = await Cart.create({
        user,
        productId,
        quantity,
        totalPrice
    });

    res.status(200).json({ success: true, message: `Product Added to Cart`, data: cartItem });
});


//@desc Remove product from cart
//@route DELETE /api/user/product/cart/:id
//@access Public
const removeFromCart = (req, res) => {
    res.status(200).json({ message: `Remove from cart` });
};


//@desc All wishlist products
//@route GET /api/user/product/wishlist
//@access Public
const allWishlistProducts = (req, res) => {
    res.status(200).json({ message: `All wishlist products` });
};


//@desc Add product to Wishlist
//@route POST /api/user/product/wishlist/:id
//@access Public
const addToWishList = (req, res) => {
    res.status(200).json({ message: `Add to wishlist` });
};


//@desc Remove product from Wishlist
//@route DELETE /api/user/product/wishlist/:id
//@access Public
const removeFromWishList = (req, res) => {
    res.status(200).json({ message: `Remove from wishlist` });
};






module.exports = {
    allCartProducts,
    addToCart,
    removeFromCart,
    allWishlistProducts,
    addToWishList,
    removeFromWishList
}
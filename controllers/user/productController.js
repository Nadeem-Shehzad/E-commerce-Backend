

//@desc Get all cart products
//@route GET /api/user/product/cart
//@access Public
const allCartProducts = (req, res) => {
    res.status(200).json({ message: `all cart products` });
};


//@desc Add product to cart
//@route POST /api/user/product/cart/:id
//@access Public
const addToCart = (req, res) => {
    res.status(200).json({ message: `Add to cart` });
};


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
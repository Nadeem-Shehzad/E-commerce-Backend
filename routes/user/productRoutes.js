const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    searchProduct,
    allCartProducts,
    addToCart,
    removeFromCart,
    allWishlistProducts,
    addToWishList,
    removeFromWishList
} = require('../../controllers/user/productController');


router.route('/cart')
    .get(allCartProducts);

router.route('/cart/:id')
    .post(addToCart)
    .delete(removeFromCart);

router.route('/wishlist')
    .get(allWishlistProducts);

router.route('/wishlist/:id')
    .post(addToWishList)
    .delete(removeFromWishList);


module.exports = router;
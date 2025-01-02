const express = require('express');

const router = express.Router();

const tokenValidator = require('../../middlewares/tokenValidator');

const {
    allCartProducts,
    addToCart,
    removeFromCart
} = require('../../controllers/user/cartController');

const {
    allWishlistProducts,
    addToWishList,
    removeFromWishList
} = require('../../controllers/user/wishListController')


// cart routes
router.route('/cart')
    .get(tokenValidator, allCartProducts)
    .post(tokenValidator, addToCart);

router.route('/cart/:_id')
    .delete(tokenValidator, removeFromCart);


// wishlist routes
router.route('/wishlist')
    .get(tokenValidator, allWishlistProducts);

router.route('/wishlist/:_id')
    .post(tokenValidator, addToWishList)
    .delete(tokenValidator, removeFromWishList);


module.exports = router;
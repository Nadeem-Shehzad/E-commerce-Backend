const express = require('express');

const router = express.Router();

const tokenValidator = require('../../middlewares/tokenValidator');

const {
    allCartProducts,
    addToCart,
    removeFromCart,
    allWishlistProducts,
    addToWishList,
    removeFromWishList
} = require('../../controllers/user/cartController');


router.route('/cart')
    .get(tokenValidator, allCartProducts);

router.route('/cart')
    .post(tokenValidator, addToCart)

router.route('/cart/:_id')
    .delete(tokenValidator, removeFromCart);

router.route('/wishlist')
    .get(allWishlistProducts);

router.route('/wishlist/:id')
    .post(addToWishList)
    .delete(removeFromWishList);


module.exports = router;
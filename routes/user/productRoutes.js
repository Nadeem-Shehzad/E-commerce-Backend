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

const {
    getAllReviews,
    addReview,
    updateReview,
    deleteReview
} = require('../../controllers/user/reviewController');


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



// review routes
router.route('/add-review')
    .post(tokenValidator, addReview);

router.route('/all-reviews/:_id')
    .get(tokenValidator, getAllReviews);

router.route('/update-review/:_id')
    .put(tokenValidator, updateReview);

router.route('/delete-review/:_id')
    .delete(tokenValidator, deleteReview);




module.exports = router;
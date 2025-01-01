const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    getProductsByCategory,
    searchProduct
} = require('../controllers/cProductController');

const tokenValidator = require('../middlewares/tokenValidator');

router.route('/')
    .get(tokenValidator, getAllProducts);

router.route('/category')
    .get(tokenValidator, getProductsByCategory);

router.route('/search-product')
    .get(tokenValidator, searchProduct);

router.route('/:_id')
    .get(tokenValidator, getSingleProduct);


module.exports = router;
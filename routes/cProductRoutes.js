const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    searchProduct
} = require('../controllers/cProductController');

const tokenValidator = require('../middlewares/tokenValidator');

router.route('/')
    .get(getAllProducts);


router.route('/search-product')
    .get(tokenValidator, searchProduct);


router.route('/:_id')
    .get(tokenValidator, getSingleProduct);


module.exports = router;
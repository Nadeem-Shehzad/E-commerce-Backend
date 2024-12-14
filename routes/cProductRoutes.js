const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    searchProduct
} = require('../controllers/cProductController');


router.route('/')
    .get(getAllProducts);


router.route('/search')
    .get(searchProduct);


router.route('/:id')
    .get(getSingleProduct);


module.exports = router;
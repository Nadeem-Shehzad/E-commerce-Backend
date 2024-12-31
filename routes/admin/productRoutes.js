const express = require('express');

const router = express.Router();

const {
    productValidation
} = require('../../middlewares/expressValidations');

const tokenValidator = require('../../middlewares/tokenValidator');

const {
    addProduct,
    updateProduct,
    deleteProduct
} = require('../../controllers/admin/productController');


router.route('/add-product')
    .post([tokenValidator, productValidation], addProduct);

router.route('/product/:id')
    .put(tokenValidator, updateProduct)
    .delete(tokenValidator, deleteProduct);


module.exports = router;
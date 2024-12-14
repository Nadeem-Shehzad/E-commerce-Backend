const express = require('express');

const router = express.Router();

const {
    addProduct,
    updateProduct,
    deleteProduct
} = require('../../controllers/admin/productController');


router.route('/product')
    .post(addProduct);

router.route('/product/:id')
    .put(updateProduct)
    .delete(deleteProduct);


module.exports = router;
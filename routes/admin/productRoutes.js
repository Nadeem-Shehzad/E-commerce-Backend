const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getSingleProduct,
    searchProduct,
    addProduct,
    updateProduct,
    deleteProduct
} = require('../../controllers/admin/productController');


router.route('/')
    .get(getAllProducts);

router.route('/')
    .post(addProduct);

router.route('/:id')
    .put(updateProduct)
    .delete(deleteProduct);

router.route('/:id')
    .get(getSingleProduct);


module.exports = router;
const express = require('express');

const router = express.Router();

const {
    productValidation
} = require('../../middlewares/expressValidations');

const tokenValidator = require('../../middlewares/tokenValidator');

const {
    addProduct,
    updateProduct,
    deleteProduct,
    cartProducts,
    wishlistProducts
} = require('../../controllers/admin/productController');


router.route('/add-product')
    .post([tokenValidator, productValidation], addProduct);

router.route('/product/:_id')
    .put(tokenValidator, updateProduct)
    .delete(tokenValidator, deleteProduct);


// cart routes    
router.route('/cart-product')
    .get(tokenValidator, cartProducts);


// wishlist routes    
router.route('/wishlist-product')
    .get(tokenValidator, wishlistProducts);    



module.exports = router;
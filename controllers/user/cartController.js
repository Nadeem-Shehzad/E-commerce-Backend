const asyncHandler = require('express-async-handler');
const Cart = require('../../models/cart');
const Product = require('../../models/productModel');



//@desc Get all cart products
//@route GET /api/user/product/cart
//@access Private
const allCartProducts = asyncHandler(async (req, res) => {

    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    const cartProducts = await Cart.find({ user: req.user.id }).skip((page - 1) * dataLimit).limit(dataLimit);

    res.status(200).json({ success: true, message: `cart products`, data: cartProducts });
});


//@desc Add product to cart
//@route POST /api/user/product/cart/:id
//@access Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const user = req.user.id;

    const productExists = await Cart.findOne({ $and: [{ productId: productId }, { user: req.user.id }] });
    if (productExists) {
        res.status(400);
        throw new Error('Product already Exists!');
    }

    if (quantity > 0) {
        const product = await Product.findById(productId);
        const totalPrice = quantity * product.price;

        const cartItem = await Cart.create({
            user,
            productId,
            quantity,
            totalPrice
        });

        res.status(200).json({ success: true, message: `Product Added to Cart`, data: cartItem });

    } else {
        res.status(400);
        throw new Error('Please select atleast one quantity of product!');
    }

});


//@desc Remove product from cart
//@route DELETE /api/user/product/cart/:id
//@access Private
const removeFromCart = asyncHandler(async(req, res) => {

    const cartId = req.params._id;
    const cart = await Cart.findById(cartId);

    if(!cart){
        res.status(404);
        throw new Error('Cart not found!');
    }

    if(cart.user.toString() === req.user.id){
        const deletedCart = await Cart.findByIdAndDelete(cartId);
        res.status(200).json({success:true, message: `Remove from cart`, data: deletedCart});
    
    } else {
        res.status(403);
        throw new Error(`Sorry! you Can't delete others cart item.`);
    }
});







module.exports = {
    allCartProducts,
    addToCart,
    removeFromCart
}
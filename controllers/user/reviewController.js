const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');
const Review = require('../../models/review');



//@desc Add reviews
//@route POST /api/user/add-review
//@access Private
const addReview = asyncHandler(async (req, res) => {

    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    const review = await Review.findOne({ $and: [{ productId: productId }, { user: req.user.id }] });
    if (review) {
        res.status(403);
        throw new Error('Already reviewed that product!');
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    let productRating = rating;
    if (product.reviews.length > 0) {
        let ratingSum = 0;

        product.reviews.forEach((review) => {
            ratingSum = ratingSum + review.rating;
        });

        productRating = ratingSum / product.reviews.length;
    }

    await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                rating: productRating
            }
        }
    );

    const r = await product.updateOne({
        $push: {
            reviews: {
                rating: rating,
                ratedBy: req.user.id,
                comment: comment || ''
            }
        }
    });

    const newReview = await Review.create({
        user: req.user.id,
        productId,
        rating,
        comment: comment || ''
    });

    res.status(201).json({ success: true, message: 'Review Addedd.', data: newReview });
});


//@desc Add reviews
//@route POST /api/user/add-review
//@access Private
const updateReview = asyncHandler(async (req, res) => {

    const reviewId = req.params._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error('Review not exists!');
    }

    if (review.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error(`Sorry, can't update other's review!`);
    }

    const product = await Product.findById(review.productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    const productReview = product.reviews.find(review => review.ratedBy.toString() === req.user.id.toString());

    const rId = productReview._id;
    const fieldsToUpdate = req.body;

    const updateQuery = {};
    for (const key in fieldsToUpdate) {
        updateQuery[`reviews.$.${key}`] = fieldsToUpdate[key];
    }

    await Product.updateOne(
        { "reviews._id": rId },
        {
            $set: updateQuery
        }
    );

    if ('rating' in req.body) {
        let productRating = req.body.rating;
        if (product.reviews.length > 0) {
            let ratingSum = 0;

            product.reviews.forEach((review) => {
                ratingSum = ratingSum + review.rating;
            });

            productRating = ratingSum / product.reviews.length;
        }

        await Product.findByIdAndUpdate(
            product._id,
            {
                $set: {
                    rating: productRating
                }
            }
        );
    }

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        req.body,
        { new: true }
    );

    res.status(200).json({ success: true, message: 'Review Updated', data: updatedReview });
});



module.exports = {
    addReview,
    updateReview
}
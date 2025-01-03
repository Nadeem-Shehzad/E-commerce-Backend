const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');
const Review = require('../../models/review');


//@desc Get reviews
//@route GET /api/user/all-reviews/:_id
//@access Private
const getAllReviews = asyncHandler(async (req, res) => {

    const page = parseInt(req.body.page) || 1;
    const dataLimit = parseInt(req.body.limit) || 2;

    const { reviewType } = req.body;

    if (reviewType === 'all') {
        const reviewData = await Review.find({ productId: req.params._id })
            .populate('user', 'name')
            .skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(201).json({ success: true, message: 'All Reviews.', data: reviewData });

    } else if (reviewType === 'mostrecent') {
        const reviewData = await Review.find({ productId: req.params._id })
            .populate('user', 'name').sort({ createdAt: -1 })
            .skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(201).json({ success: true, message: 'Recent Reviews.', data: reviewData });

    } else if (reviewType === 'old') {
        const reviewData = await Review.find({ productId: req.params._id })
            .populate('user', 'name').sort({ createdAt: 1 })
            .skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(201).json({ success: true, message: 'Old Reviews.', data: reviewData });

    } else if (reviewType === 'positivefirst') {
        const reviewData = await Review.find({ productId: req.params._id })
            .populate('user', 'name').sort({ rating: -1 })
            .skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(201).json({ success: true, message: 'Positive Reviews.', data: reviewData });

    } else if (reviewType === 'negativefirst') {
        const reviewData = await Review.find({ productId: req.params._id })
            .populate('user', 'name').sort({ rating: 1 })
            .skip((page - 1) * dataLimit).limit(dataLimit);

        res.status(201).json({ success: true, message: 'Positive Reviews.', data: reviewData });

    } else {
        res.status(400);
        throw new Error('Invalid filter Type!');
    }
});


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

    const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        {
            $push: {
                reviews: {
                    rating: rating,
                    ratedBy: req.user.id,
                    comment: comment || '',
                },
            },
        },
        { new: true }
    );

    let productRating = rating;
    if (updatedProduct.reviews.length > 1) {
        let ratingSum = 0;

        updatedProduct.reviews.forEach((review) => {
            ratingSum = ratingSum + review.rating;
        });

        productRating = ratingSum / updatedProduct.reviews.length;
    }

    await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                rating: productRating.toFixed(1)
            }
        }
    );

    const newReview = await Review.create({
        user: req.user.id,
        productId,
        rating,
        comment: comment || ''
    });

    res.status(201).json({ success: true, message: 'Review Addedd.', data: newReview });
});


//@desc Update reviews
//@route PUT /api/user/update-review
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

    const updatedProduct = await Product.findOneAndUpdate(
        { "reviews._id": rId },
        { $set: updateQuery },
        { new: true }
    );

    if ('rating' in req.body) {
        let productRating = req.body.rating;
        if (updatedProduct.reviews.length > 1) {
            let ratingSum = 0;

            updatedProduct.reviews.forEach((review) => {
                ratingSum = ratingSum + review.rating;
            });

            productRating = ratingSum / updatedProduct.reviews.length;
        }

        await Product.findByIdAndUpdate(
            product._id,
            {
                $set: {
                    rating: productRating.toFixed(1)
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


//@desc Delete reviews
//@route DELETE /api/user/delete-review/:_id
//@access Private
const deleteReview = asyncHandler(async (req, res) => {

    const reviewId = req.params._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        res.status(404);
        throw new Error('Review not exists!');
    }

    if (review.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error(`Sorry, can't delete other's review!`);
    }

    const product = await Product.findById(review.productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found!');
    }

    const productReview = product.reviews.find(review => review.ratedBy.toString() === req.user.id.toString());

    const newData = await Product.findOneAndUpdate(
        { "reviews._id": productReview._id },
        { $pull: { reviews: productReview } },
        { new: true }
    );

    let productRating = 0;
    if (newData.reviews.length >= 1) {
        let ratingSum = 0;

        newData.reviews.forEach((review) => {
            ratingSum = ratingSum + review.rating;
        });

        productRating = ratingSum / newData.reviews.length;
    }

    await Product.findByIdAndUpdate(
        product._id,
        {
            $set: {
                rating: productRating.toFixed(1)
            }
        }
    );

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ success: true, message: 'Review Deleted.', data: deletedReview });
});


module.exports = {
    getAllReviews,
    addReview,
    updateReview,
    deleteReview
}
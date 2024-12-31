const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');


//@desc Get all Users
//@route GET /api/users
//@access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.findUser(req.user.email);

    if (user.isAdmin) {
        const allUsersData = await User.find({ isAdmin: { $ne: true } }).select('-password');
        res.status(200).json({ success: true, message: 'All Users Data', data: allUsersData });
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});


//@desc block User
//@route PUT /api/auth/admin/block-user
//@access Public
const blockUser = asyncHandler(async (req, res) => {
    const customerID = req.params._id;
    const user = await User.findUser(req.user.email);

    const customer = await User.findOne({ _id: customerID });

    if (!customer) {
        res.status(404);
        throw new Error('Customer not Found!');
    }

    if (user.isAdmin) {

        const blockedUser = await User.findByIdAndUpdate(
            customerID,
            {
                $set: { isBlocked: true }
            },
            { new: true }
        );

        res.status(201).json({ success: true, message: 'User is Blocked!', data: blockedUser });
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});


//@desc block User
//@route PUT /api/auth/admin/block-user
//@access Public
const unBlockUser = asyncHandler(async (req, res) => {
    const customerID = req.params._id;
    const user = await User.findUser(req.user.email);

    const customer = await User.findOne({ _id: customerID });

    if (!customer) {
        res.status(404);
        throw new Error('Customer not Found!');
    }

    if (user.isAdmin) {

        const unBlockedUser = await User.findByIdAndUpdate(
            customerID,
            {
                $set: { isBlocked: false }
            },
            { new: true }
        );

        res.status(201).json({ success: true, message: 'User is unBlocked!', data: unBlockedUser });
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});


//@desc delete Users
//@route DELETE /api/auth/admin/deleteUser
//@access Public
const deleteUser = asyncHandler(async (req, res) => {
    const customerID = req.params._id;
    const user = await User.findUser(req.user.email);

    const customer = await User.findOne({ _id: customerID });

    if (!customer) {
        res.status(404);
        throw new Error('Customer not Found!');
    }

    if (user.isAdmin) {
        const deletedUser = await User.findByIdAndDelete(customerID);
        res.status(200).json({ success: true, message: 'Customer Account Deleted', data: deletedUser });
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});



module.exports = {
    getAllUsers,
    blockUser,
    unBlockUser,
    deleteUser
};
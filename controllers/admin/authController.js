const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');


//@desc Get all Users
//@route GET /api/users
//@access Public
const getAllUsers = asyncHandler(async (req, res) => {
    const user = await User.findUser(req.user.email);

    if(user.isAdmin){
        const allUsers = await User.find({ isAdmin: { $ne: true } }).select('-password');
        res.status(200).json(allUsers);
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});


//@desc block User
//@route PUT /api/auth/admin/blockUser
//@access Public
const blockUser = asyncHandler(async (req, res) => {
    const user = await User.findUser(req.user.email);

    if(user.isAdmin){
        const allUsers = await User.find({ isAdmin: { $ne: true } }).select('-password');
        res.status(200).json(allUsers);
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});


//@desc delete Users
//@route DELETE /api/auth/admin/deleteUser
//@access Public
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findUser(req.user.email);

    if(user.isAdmin){
        const allUsers = await User.find({ isAdmin: { $ne: true } }).select('-password');
        res.status(200).json(allUsers);
    } else {
        res.status(403);
        throw new Error('Access denied!');
    }
});



module.exports = {
    getAllUsers,
    deleteUser
};
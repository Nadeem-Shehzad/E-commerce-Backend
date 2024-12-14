const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


//@desc Register User
//@route POST /api/user/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errorMsg(errors));
    }

    const { name, phoneNumber, email, password, isAdmin, address, city, zipCode } = req.body;

    const userAvailable = await User.findUser(email);
    if (userAvailable) {
        res.status(400);
        throw new Error('User Already Exists!');
    }

    const hashPassword = await User.hashedPassword(password);

    const user = await User.create({
        name,
        phoneNumber,
        email,
        password: hashPassword,
        isAdmin,
        address,
        city,
        zipCode
    });

    res.status(201).json(user);
});



//@desc Login User
//@route POST /api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error(errorMsg(errors));
    }

    const { email, password } = req.body;

    const user = await User.findUser(email);
    if (!user) {
        res.status(400);
        throw new Error('User not Available!');
    }

    const passwordMatched = await user.isPasswordMatched(password);

    if (user && passwordMatched) {
        const accessToken = jwt.sign({
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            }
        }, process.env.TOKEN_SECRET, { expiresIn: '10m' });

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error('email or password is not valid!');
    }
});



//@desc Get all Users
//@route GET /api/users
//@access Public
const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await User.find().select('-password');
    res.status(200).json(allUsers);
});


//@desc Get current user
//@route GET /api/users/currentUser
//@access Public
const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});


//@desc Update user info
//@route PUT /api/users/updateInfo/:id
//@access Public
const updateUserInfo = asyncHandler(async (req, res) => {
    const id = req.params._id;
    const dataToUpdate = req.body;
    const currentUser = req.user;

    if (currentUser.id !== id) {
        res.status(403);
        throw new Error('Access denied. Not authorized to update other user !');
    }

    const updatedData = await User.findByIdAndUpdate(
        id,
        dataToUpdate,
        { new: true }
    );

    res.status(200).json(updatedData);
});


// custom error function
const errorMsg = (errors) => {
    const fieldName = errors.array()[0].path;
    const errorMsg = errors.array()[0].msg;
    const error = `${fieldName}: ${errorMsg}`;

    return error;
}


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getCurrentUser,
    updateUserInfo
}
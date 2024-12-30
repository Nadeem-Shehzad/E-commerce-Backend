const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


//setup cloudinary to store images in cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


// mail send functionality
const sendResetPasswordMail = async (name, email, token) => {
    try {

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'nadeemshehzad.mayo@gmail.com',
                pass: 'djjslgqfukojhvuz',
            },
        });

        const mailOptions = {
            from: 'nadeemshehzad.mayo@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: '<p> Hi ' + name + ', copy link <a href="http://localhost:8000/api/auth/reset-password?token=' + token + '"> and reset your password'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Mail has been sent:- ', info.response);
            }
        })

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}


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

    let imageUploadResult = '';
    if (req.files && req.files.image) {
        //upload image to cloudinary server
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
            public_id: `${Date.now()}`,
            resource_type: "auto",
            folder: "images"
        });

        // check image is uploaded successfully or not
        if (result && result.secure_url) {
            imageUploadResult = result.secure_url;
        }
    }

    const user = await User.create({
        name,
        phoneNumber,
        email,
        password: hashPassword,
        image: imageUploadResult,
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
        }, process.env.TOKEN_SECRET, { expiresIn: '30m' });

        const userData = await User.findByIdAndUpdate(
            user.id,
            { $set: { token: accessToken } },
            { new: true }
        )

        res.status(200).json({ success: true, message: 'User Details', data: userData });
    } else {
        res.status(401);
        throw new Error('email or password is not valid!');
    }
});


//@desc Get current user
//@route GET /api/users/currentUser
//@access Private
const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});


//@desc forgot password
//@route POST /api/auth/forgot-password
//@access Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const userData = await User.findUser(email);
    if (!userData) {
        res.status(404);
        throw new Error('This email does not exists!');
    }

    const randomString = randomstring.generate();

    const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
    sendResetPasswordMail(userData.name, userData.email, randomString);
    res.status(200).json({ success: true, msg: 'Please check your mail inbox. and reset your password' });
});


//@desc reset password
//@route POST /api/auth/reset-password
//@access Public
const resetPassword = asyncHandler(async (req, res) => {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });

    if (tokenData) {
        const newPassword = req.body.password;
        const newPasswordHashed = await User.hashedPassword(newPassword);
        const userData = await User.findByIdAndUpdate(
            tokenData.id,
            {
                $set: {
                    password: newPasswordHashed,
                    token: ''
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Your Password has been reset', data: userData });
    } else {
        res.status(400).json({ success: true, message: 'The link has been expired!' });
    }
});


//@desc Update user info
//@route PUT /api/users/updateInfo/:id
//@access Private
const updateUserInfo = asyncHandler(async (req, res) => {
    const id = req.params._id;
    const dataToUpdate = req.body;

    if (req.user.id !== id) {
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


//@desc Delete user Account
//@route DELETE /api/auth/deleteUser
//@access Private
const deleteUserAccount = asyncHandler(async (req, res) => {
    const id = req.params._id;

    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw Error('User not found!');
    }

    if (user._id.toString() !== req.user.id) {
        res.status(403);
        throw Error('Access denied. Not authorized to delete other user !');
    }

    const deletedAccount = await User.findByIdAndDelete(id);

    res.status(200).json(deletedAccount);
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
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updateUserInfo,
    deleteUserAccount
}
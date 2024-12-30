const express = require('express');
const {
    registrationValidation,
    loginValidation
} = require('../middlewares/expressValidations');

const tokenValidator = require('../middlewares/tokenValidator');

const router = express.Router();

const {
    getAllUsers
} = require('../controllers/admin/authController');

const {
    registerUser,
    loginUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updateUserInfo,
    deleteUserAccount
} = require('../controllers/cAuthController');


router.route('/register')
    .post(registrationValidation, registerUser);


router.route('/login')
    .post(loginValidation, loginUser);


router.route('/current-user')
    .get(tokenValidator, getCurrentUser);


router.route('/forgot-password')
    .post(forgotPassword);


router.route('/reset-password')
    .post(resetPassword);


// admin specific routes
router.route('/admin')
    .get(tokenValidator, getAllUsers);


router.route('/update-info/:_id')
    .put(tokenValidator, updateUserInfo); // we can also update password through this api

router.route('/delete-account/:_id')
    .delete(tokenValidator, deleteUserAccount);


module.exports = router;
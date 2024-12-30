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


// admin specific routes
router.route('/admin')
    .get(tokenValidator, getAllUsers);


router.route('/update-info/:_id')
    .put(tokenValidator, updateUserInfo);

router.route('/delete-account/:_id')
    .delete(tokenValidator, deleteUserAccount);


module.exports = router;
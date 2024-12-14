const express = require('express');
const {
    registrationValidation,
    loginValidation
} = require('../middlewares/expressValidations');

const tokenValidator = require('../middlewares/tokenValidator');

const router = express.Router();

const {
    registerUser,
    loginUser,
    getAllUsers,
    getCurrentUser,
    updateUserInfo
} = require('../controllers/authController');


router.route('/register')
    .post(registrationValidation, registerUser);

router.route('/login')
    .post(loginValidation, loginUser);

router.route('/')
    .get(getAllUsers);


router.route('/currentUser')
    .get(tokenValidator, getCurrentUser);


router.route('/updateInfo/:_id')
    .put(tokenValidator, updateUserInfo);


module.exports = router;
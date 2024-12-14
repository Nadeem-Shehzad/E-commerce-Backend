const { body } = require('express-validator');


const registrationValidation = [
    body('name')
        .notEmpty().withMessage('Name Required!')
        .trim()
        .isLength({ min: 2 }).withMessage('Min 2 chars required!')
        .isLength({ max: 12 }).withMessage('Max 12 chars allowed!')
        .matches(/^[a-zA-Z]+$/)
        .withMessage('Name can only contain alphabetic characters (no numbers or special characters)'),

    body('phoneNumber')
        .notEmpty().withMessage('Phone Number Required!')
        .trim()
        .isLength({ min: 11 }).withMessage('Min 11 chars required!')
        .isLength({ max: 11 }).withMessage('Max 11 chars allowed!'),

    body('email')
        .notEmpty().withMessage('Email Required!')
        .isEmail().withMessage('Invalid Email Format!')
        .trim(),

    body('password')
        .notEmpty().withMessage('Password Required!')
        .trim()
        .isLength({ min: 4 }).withMessage('Minimum 4 chars required!')
        .isLength({ max: 16 }).withMessage('Maximum 16 chars allowed!'),

    body('address')
        .optional()
        .trim()
        .isLength({ min: 4 }).withMessage('Minimum 4 chars required!')
        .isLength({ max: 24 }).withMessage('Maximum 16 chars allowed!'),

    body('city')
        .optional()
        .isString().withMessage('Only alphabetic characters allowed!')
        .trim()
        .isLength({ min: 4 }).withMessage('Minimum 4 chars required!')
        .isLength({ max: 16 }).withMessage('Maximum 16 chars allowed!'),

    body('zipCode')
        .optional()
        .trim()
        .isLength({ max: 16 }).withMessage('Maximum 16 chars allowed!')
];


const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email Required!')
        .isEmail().withMessage('Invalid Email Format!')
        .trim(),

    body('password')
        .notEmpty().withMessage('Password Required!')
        .trim()
        .isLength({ min: 4 }).withMessage('Minimum 4 chars required!')
        .isLength({ max: 16 }).withMessage('Maximum 16 chars allowed!'),
];



module.exports = {
    registrationValidation,
    loginValidation
}
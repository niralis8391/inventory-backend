const { body } = require('express-validator');

exports.signupValidator = [
    body('name').notEmpty().withMessage("name is required").isLength({ min: 3 }).withMessage("name must be atleast 3 characers"),
    body('email').notEmpty().withMessage("email is required").isEmail().withMessage("invalid email format"),
    body('password').notEmpty().withMessage("password is requird").isLength({ min: 5 }).withMessage("password must be atleast 5 characters")
];

exports.loginValidator = [
    body('email').notEmpty().withMessage("email is required").isEmail().withMessage("invalid email format"),
    body('password').notEmpty().withMessage("password is requird").isLength({ min: 5 }).withMessage("password must be atleast 5 characters")
]
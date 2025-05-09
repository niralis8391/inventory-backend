const { body } = require('express-validator');


exports.customerValidator = [
    body('name').notEmpty().withMessage("name is required"),
    body('email').notEmpty().withMessage("email is required").isEmail().withMessage("invalid email format"),
    body('password').notEmpty().withMessage("password is required").isLength({ min: 5 }).withMessage("password must be atleast 5 characters"),
    body('phone').notEmpty().withMessage("phone is required"),
    body('address').notEmpty().withMessage("address is required")
];

exports.loginValidator = [
    body('email').notEmpty().withMessage("email is required").isEmail().withMessage("invalid email format"),
    body('password').notEmpty().withMessage("password is requird").isLength({ min: 5 }).withMessage("password must be atleast 5 characters")
]
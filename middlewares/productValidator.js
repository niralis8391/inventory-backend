const { body } = require('express-validator');

exports.productValidator = [
    body('productName').notEmpty().withMessage("productName is required").isLength({ min: 3 }).withMessage("name must be atleast 3 characters"),
    body('description').notEmpty().withMessage("description is required").isLength({ min: 10 }).withMessage("description must be atleast 10 characters"),
    body('category').notEmpty().withMessage("category is required").isLength({ min: 3 }).withMessage("category must be atleast 3 characters"),
    body('price').notEmpty().withMessage("price is required"),
    body('quantity').notEmpty().withMessage("quantity is required")
]
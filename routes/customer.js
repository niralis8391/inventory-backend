const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const customerValidator = require('../middlewares/customerValidator')
const isAuth = require('../middlewares/isAuth')


router.post('/signup', customerValidator.customerValidator, customerController.postSignup)
router.post('/login', customerValidator.loginValidator, customerController.postLogin)
router.get('/customerData', isAuth, customerController.customerData);
router.put('/updateProfile', isAuth, customerController.updateProfile);

module.exports = router;

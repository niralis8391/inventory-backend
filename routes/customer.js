const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');
const customerValidator = require('../middlewares/customerValidator')
const isAuth = require('../middlewares/isAuth')


router.post('/signup', customerController.postSignup)
router.post('/login', customerController.postLogin)
router.get('/customerData', isAuth, customerController.customerData);
router.put('/updateProfile', isAuth, customerController.updateProfile);
router.post('/reset', isAuth, customerController.postReset);
router.get('/getOrderByStatus', isAuth, customerController.findOrderByStatus)
router.get('/getTotalOrdersCount', isAuth, customerController.getTotalOrdersCount)

module.exports = router;

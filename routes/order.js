const express = require('express');
const orderController = require('../controllers/order');
const isAuth = require('../middlewares/isAuth')

const router = express.Router();


router.post('/createOrder', isAuth, orderController.createOrder)
router.get('/getOrderDetails', isAuth, orderController.getOrderDetails)
router.get('/getOrders', isAuth, orderController.getOrders)
router.get('/orderCount', isAuth, orderController.ordersCount)
router.get('/pendingOrders', isAuth, orderController.pendingOrderDetails)
router.put('/updateStatus/:orderId', isAuth, orderController.updateOrderStatus)


module.exports = router;
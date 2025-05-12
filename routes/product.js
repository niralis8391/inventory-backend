const express = require('express');
const productController = require('../controllers/product');
const productValidator = require('../middlewares/productValidator');
const isAuth = require('../middlewares/isAuth')


const router = express.Router();


router.post('/createProduct', isAuth, productValidator.productValidator, productController.addProduct)
router.get('/getAll', isAuth, productController.getAll)
router.get('/productCounts', isAuth, productController.productcount)

router.get('/getProductById/:productId', isAuth, productController.getProductById)
router.put('/updateProduct/:productId', isAuth, productController.updateProduct)
router.delete('/deleteProduct/:productId', isAuth, productController.deleteProduct)

router.get('/getProductByCategory/:category', productController.getProductByCategory)
router.get('/suggest', productController.getSuggestProduct)


module.exports = router;
const express = require('express');
const productController = require('../controllers/product');
const productValidator = require('../middlewares/productValidator');
const isAuth = require('../middlewares/isAuth')
const upload = require('../middlewares/upload');


const router = express.Router();


router.get('/getAll', isAuth, productController.getAll)

router.get('/productCounts', isAuth, productController.productcount)
router.post('/createProduct', isAuth, upload.single('image'), productController.addProduct)
router.get('/getProductById/:productId', isAuth, productController.getProductById)
router.put('/updateProduct/:productId', isAuth, upload.single('image'), productController.updateProduct)
router.delete('/deleteProduct/:productId', isAuth, productController.deleteProduct)

router.get('/getProductByCategory/:category', productController.getProductByCategory)
router.get('/suggest', productController.getSuggestProduct)


module.exports = router;
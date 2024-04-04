const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

router.post('/create', productController.addProduct)
router.get('/getOneProduct/:id', productController.getOne)
router.get('/getAllProducts', productController.getAll)
router.get('/getAllPageProducts', productController.getAllPage)
router.put('/updateProduct/:id', productController.editProduct)
router.delete('/deleteProduct/:id', productController.deleteProduct)
router.get('/getDesc/:productId', productController.getDescriptionById)
router.put('/editDesc/:productId/:descriptionId', productController.editDescriptionById)
router.delete('/deleteDesc/:id', productController.deleteDescriptionById)
router.post('/createDescription', productController.createDescription)

module.exports = router

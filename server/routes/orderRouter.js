const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/addOrder', orderController.addOrder)
router.put('/updateStatus/:id', orderController.updateStatusOrder)
router.delete('/deleteOrder/:id', orderController.deleteOrder)
router.post('/addProductToOrder', orderController.addProductToOrder)
router.delete('/deleteProduct/:id', orderController.deleteProductToOrder)
router.get('/getOrdersAll', orderController.getOrdersAll)
router.get('/getOrderOne/:userId', orderController.getOrderOne)
router.get('/getOrderById/:id', orderController.getOrderById)

module.exports = router

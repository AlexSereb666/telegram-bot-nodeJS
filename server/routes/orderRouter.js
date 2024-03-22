const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/addOrder', orderController.addOrder)
router.put('/updateStatus/:id', orderController.updateStatusOrder)
router.put('/updateStatusCourier/:id', orderController.updateStatusOrderCourier)
router.delete('/deleteOrder/:id', orderController.deleteOrder)
router.post('/addProductToOrder', orderController.addProductToOrder)
router.delete('/deleteProduct/:id', orderController.deleteProductToOrder)
router.get('/getOrdersAll', orderController.getOrdersAll)
router.get('/getOrderOne/:userId', orderController.getOrderOne)
router.get('/getOrderById/:id', orderController.getOrderById)
router.get('/ordersBarista/:id', orderController.getUnassignedAndBaristaOrders)
router.get('/getBaristaOrdersWithStatus/:baristaId/:status', orderController.getBaristaOrdersWithStatus)
router.get('/getCourierOrdersWithStatus/:courierId/:status', orderController.getCourierOrdersWithStatus)
router.get('/getCourierOrdersWithStatusFree/:status', orderController.getCourierOrdersWithStatusFree)

module.exports = router

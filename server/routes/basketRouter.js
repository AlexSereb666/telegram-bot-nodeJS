const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/', basketController.addToBasket)
router.get('/getBasket/:id', basketController.getBasket)
router.get('/getProducts/:id', basketController.getAllProductsInBasket)
router.delete('/:id', basketController.removeFromBasket)

module.exports = router

const Router = require('express')
const router = new Router()
const promocodeController = require('../controllers/promocodeController')

router.post('/create', promocodeController.addPromoCode);
router.put('/edit/:id', promocodeController.editPromoCode);
router.get('/:id', promocodeController.getPromoCodeById);
router.get('/code/:code', promocodeController.getPromoCodeByCode);
router.get('/product/:id', promocodeController.getPromoCodesByProduct);
router.get('/current/:current', promocodeController.getAllPromoCodesCurrent);
router.delete('/delete/:id', promocodeController.deletePromoCode);
router.post('/addPromoCodeToProduct', promocodeController.addPromoCodeToProduct)

module.exports = router

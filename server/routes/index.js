const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const feedbackRouter = require('./feedbackRouter')
const productRouter = require('./productRouter')
const typeRouter = require('./typeRouter')
const viewRouter = require('./viewRouter')
const basketRouter = require('./basketRouter')
const promocodeRouter = require('./promocodeRouter')

router.use('/user', userRouter)
router.use('/feedback', feedbackRouter)
router.use('/product', productRouter)
router.use('/type', typeRouter)
router.use('/view', viewRouter)
router.use('/basket', basketRouter)
router.use('/promocode', promocodeRouter)

module.exports = router
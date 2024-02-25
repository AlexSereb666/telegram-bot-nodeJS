const Router = require('express')
const router = new Router()
const viewController = require('../controllers/viewController')

router.post('/create', viewController.addView)
router.get('/getOneView/:id', viewController.getOne)
router.get('/getAllViews', viewController.getAll)
router.put('/updateView/:id', viewController.editView)
router.delete('/deleteView/:id', viewController.deleteView)

module.exports = router

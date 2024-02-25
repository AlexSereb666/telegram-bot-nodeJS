const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')

router.post('/create', typeController.addType)
router.get('/getOneType/:id', typeController.getOne)
router.get('/getAllTypes', typeController.getAll)
router.put('/updateType/:id', typeController.editType)
router.delete('/deleteType/:id', typeController.deleteType)

module.exports = router

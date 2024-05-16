const Router = require('express')
const router = new Router()
const maintenanceController = require('../controllers/maintenanceController')

router.post('/addMaintenance', maintenanceController.addMaintenance)
router.put('/editMaintenance/:id', maintenanceController.editMaintenance)
router.delete('/delete/:id', maintenanceController.deleteMaintenance)
router.get('/getAll', maintenanceController.getAll)

module.exports = router

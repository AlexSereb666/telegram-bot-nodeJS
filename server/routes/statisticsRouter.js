const Router = require('express')
const router = new Router()
const statisticsController = require('../controllers/statisticsController')

router.post('/productStatistics', statisticsController.getProductStatistics);
router.post('/salesStatistics', statisticsController.getSalesStatistics);
router.post('/employeeStatistics', statisticsController.getEmployeeStatistics);
router.post('/clientStatistics', statisticsController.getClientStatistics);

module.exports = router

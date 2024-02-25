const Router = require('express')
const router = new Router()
const feedbackController = require('../controllers/feedbackController')

router.post('/create', feedbackController.createFeedback)
router.put('/updateStatus/:id', feedbackController.updateFeedbackStatus)
router.get('/getAllFeedback', feedbackController.getAllFeedbacks)
router.get('/getOneFeedback/:id', feedbackController.getFeedbackById)
router.get('/getOneFeedbackUser/:id', feedbackController.getFeedbackByUserId)
router.delete('/deleteFeedback/:id', feedbackController.deleteFeedbackById)

module.exports = router

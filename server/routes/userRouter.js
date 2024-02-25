const Router = require('express')
const router = new Router()
const userController = require('../controllers/userControllers')

router.post('/registration', userController.registration)
router.put('/updateData/:id', userController.updateUserData)
router.put('/updateRole/:id', userController.updateUserRole)
router.get('/getOneUser/:id', userController.getUserByTelegramId)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/getAllUserRole', userController.getUsersByRole)
router.delete('/deleteUser/:id', userController.deleteUserByTelegramId)
router.get('/getUserById/:id', userController.getUserById)

module.exports = router

import express from "express"
import userController from '../controllers/userController'

const router = express.Router()

router.get('/login',userController.getLogin)
router.get('/register',userController.getRegister)

router.get('/home', userController.Home)
router.post('/create_User', userController.createUser)

module.exports = router;
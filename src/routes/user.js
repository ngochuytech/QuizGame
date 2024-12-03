import express from "express"
import userController from '../controllers/userController.js'

const router = express.Router()

router.get('/login',userController.getLogin)
router.get('/register',userController.getRegister)

router.get('/home', userController.Home)
router.post('/create_User', userController.createUser)
router.post('/login_User',userController.loginUser)

export default  router;
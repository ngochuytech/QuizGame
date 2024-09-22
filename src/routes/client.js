import express from "express"
import clientController from '../controllers/clientController'
const router = express.Router()

router.get('/home',clientController.getHome)
router.get('/result',clientController.getResult)
router.get('/member', clientController.getMember)

module.exports = router;
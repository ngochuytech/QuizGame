import express from "express"
import clientController from '../controllers/clientController'
const router = express.Router()

router.get('/home/:classID',clientController.getHomeClass)
router.get('/home',clientController.getHome)


router.get('/result',clientController.getResult)
router.get('/member', clientController.getMember)
router.get('/apiClass', clientController.createClass)

// Test API
router.get('/getAllClass',clientController.getAllClasses)

module.exports = router;
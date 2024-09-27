import express from "express"
import clientController from '../controllers/clientController'
const router = express.Router()

router.get('/home/:classID',clientController.getHomeClass)
router.get('/home',clientController.getHome)


router.get('/result/:classID',clientController.getResult)
router.get('/member', clientController.getMember)
router.post('/createClass', clientController.createClass)

router.get('/information',clientController.getInformation)
router.get('/changePW', clientController.getChangePW)
// Test API
router.get('/getAllClass',clientController.getAllClasses)

module.exports = router;
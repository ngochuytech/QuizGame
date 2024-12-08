import express from "express"
import hostController from "../controllers/hostController"
import hostMiddleware from '../middleware/hostMiddleware'
const router = express.Router()

router.get('/createQuiz/:idClass', hostMiddleware.filterUser , hostController.getCreateQuiz)
router.get('/leaderboard/:idClass/:idExam',hostMiddleware.checkStateExam , hostMiddleware.filterUser , hostController.getLeaderboard)
router.get('/leaderboardHistory/:idClass/:idExam', hostMiddleware.filterUser , hostController.getLeaderboardHistory);
router.get('/manageClass/:idClass', hostMiddleware.filterUser , hostController.getManageClass)
router.get('/deleteQuestion', hostController.deleteQuestion)
router.get('/manageQuestion/:idClass', hostMiddleware.filterUser ,hostController.getManageQuestion)

router.post('/UpdateQuestion/:idClass', hostMiddleware.filterUser ,hostController.AddQuestion)
router.get('/UpdateQuestion/:idClass', hostMiddleware.filterUser ,hostController.UpdateQuestion)

router.post('/deleteClass/:idClass', hostMiddleware.filterUser ,hostController.deleteClass);
router.post('/updateNameClass/:idClass', hostMiddleware.filterUser ,hostController.updateNameClass)

router.post('/createExam/:idClass', hostMiddleware.filterUser ,hostController.createExam);
router.post('/cancelTheTest/:idClass/:idExam', hostMiddleware.filterUser ,hostController.cancelTheTest);

module.exports = router;
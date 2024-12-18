import express from "express"
import hostController from "../controllers/hostController"
import hostMiddleware from '../middleware/hostMiddleware'
const router = express.Router()

router.get('/createQuiz/:idClass', hostController.getCreateQuiz)
router.get('/leaderboard/:idClass/:idExam',hostMiddleware.checkStateExam , hostController.getLeaderboard)
router.get('/leaderboardHistory/:idClass/:idExam', hostController.getLeaderboardHistory);
router.get('/manageClass/:idClass', hostController.getManageClass)
router.get('/deleteQuestion', hostController.deleteQuestion)
router.get('/manageQuestion/:id', hostController.getManageQuestion)

router.post('/UpdateQuestion/:id', hostController.AddQuestion)
router.get('/UpdateQuestion/:id', hostController.UpdateQuestion)

router.post('/deleteClass/:idClass', hostController.deleteClass);
router.post('/updateNameClass/:idClass', hostController.updateNameClass)

router.post('/createExam/:idClass', hostController.createExam);
router.post('/cancelTheTest/:idClass/:idExam', hostController.cancelTheTest);

module.exports = router;
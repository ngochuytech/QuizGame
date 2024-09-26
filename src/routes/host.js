import express from "express"
import hostController from "../controllers/hostController"
const router = express.Router()

router.get('/createQuiz', hostController.getCreateQuiz)
router.get('/leaderboard', hostController.getLeaderboard)
router.get('/manageClass', hostController.getManageClass)
router.get('/manageQuestion', hostController.getManageQuestion)

module.exports = router;
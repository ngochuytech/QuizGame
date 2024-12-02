import express from "express"
import root from '../controllers/root'

const router = express.Router()

router.get('/', root.Home)
module.exports = router;
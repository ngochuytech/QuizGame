import express from "express"
import clientController from '../controllers/clientController.js'
import clientMiddleWare from '../middleware/clientMiddleware.js'
import multer from "multer"
import path from "path"
import jwt from "../middleware/jwtAction.js"

import appRoot from 'app-root-path'

const router = express.Router()

router.get('/home/:classID', clientMiddleWare.filterUser ,clientController.getHomeClass)
router.get('/home',clientController.getHome)
router.post('/leaveClass/:classID', clientController.leaveClass)

router.get('/result/:classID', clientMiddleWare.filterUser ,clientController.getResult)

router.get('/notice/:classID', clientMiddleWare.filterUser ,clientController.getNotice)
router.get('/deleteNotice/:classID',clientController.deleteNotice)



router.get('/member/:classID', clientMiddleWare.filterUser , clientController.getMember)
router.get('/deleteMember/:classID', clientController.deleteMember)
router.post('/addMember/:classID', clientController.addMember);

router.post('/createClass', clientController.createClass)
router.get('/getAllClass',clientController.getAllClasses)
router.get('/joinClass/:classID',clientController.joinClass)

router.get('/information',clientController.getInformation)
router.get('/changePW', clientController.getChangePW)
router.post('/editAccount', clientController.editAccount)
router.post('/changePW', clientController.editPassword)

router.get('/waitingRoom/:classID/:examID',clientMiddleWare.checkStateExam, clientMiddleWare.filterUser , clientController.getWaitingRoom);

router.get('/quizStart/:classID/:examID', clientMiddleWare.filterUser ,clientController.quizStart);

router.post('/createResultExam/:classID', clientMiddleWare.filterUser ,clientController.createResultExam);

router.post('/resultexam/:resultID', clientController.postResultExam);

router.get('/resultexam/:classID/:examID/:resultID', clientController.getResultExam);

router.get('/logout', clientController.logout);
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(appRoot.path, 'public/images'));
    },
    
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        cb(null, IDUser + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

//Test upload File anh
router.post('/upload-profile-pic', upload.single('img_upload'), clientController.handleUpLoadFile)



export default  router;
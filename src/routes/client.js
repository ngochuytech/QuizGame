import express from "express"
import clientController from '../controllers/clientController'
import multer from "multer"
import path from "path"
import jwt from "../middleware/jwtAction"

var appRoot = require('app-root-path')

const router = express.Router()

router.get('/home/:classID',clientController.getHomeClass)
router.get('/home',clientController.getHome)
router.post('/leaveClass/:classID', clientController.leaveClass)

router.get('/result/:classID',clientController.getResult)

router.get('/member/:classID', clientController.getMember)
router.get('/deleteMember/:classID', clientController.deleteMember)
router.post('/addMember/:classID', clientController.addMember);

router.post('/createClass', clientController.createClass)
router.get('/getAllClass',clientController.getAllClasses)

router.get('/information',clientController.getInformation)
router.get('/changePW', clientController.getChangePW)
router.post('/editAccount', clientController.editAccount)
router.post('/changePW', clientController.editPassword)

router.get('/waitingRoom/:classID/:examID', clientController.getWaitingRoom);

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



module.exports = router;
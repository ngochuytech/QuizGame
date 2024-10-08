import express from "express"
import clientController from '../controllers/clientController'
import multer from "multer"
import path from "path"
var appRoot = require('app-root-path')

const router = express.Router()

router.get('/home/:classID',clientController.getHomeClass)
router.get('/home',clientController.getHome)


router.get('/result/:classID',clientController.getResult)
router.get('/member/:classID', clientController.getMember)
router.get('/deleteMember/:classID', clientController.deleteMember)
router.post('/createClass', clientController.createClass)

router.get('/information',clientController.getInformation)
router.get('/changePW', clientController.getChangePW)
// Test API
router.get('/getAllClass',clientController.getAllClasses)

router.post('/editAccount', clientController.editAccount)

router.post('/changePW', clientController.editPassword)


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, appRoot + '/public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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
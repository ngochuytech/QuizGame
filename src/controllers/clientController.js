import upload from '../middleware/userMiddle'
import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'
import multer from 'multer'

let getHome = async (req, res) => {
    const listAllClass = await classService.getAllClass();
    return res.render('Client_User/Home.ejs', { currnetClassID: '-1', listClass: listAllClass, listExam: [] })
}

let getHomeClass = async (req, res) => {
    // Lấy danh sách các lớp hiện có của user
    const listAllClass = await classService.getAllClass();
    let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    const currnetClass = await classService.getCurrentClass(ClassId);
    const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
    return res.render('Client_User/Home.ejs', { currnetClassID: ClassId, listClass: listAllClass, listExam: listCurrentExam })
}

let getResult = async (req, res) => {
    // Lấy danh sách các lớp hiện có của user
    const listAllClass = await classService.getAllClass();
    let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    const currnetClass = await classService.getCurrentClass(ClassId);
    const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
    const listResult = await resultService.filterResultByExam(listCurrentExam);
    return res.render('Client_User/Result.ejs', { currnetClassID: ClassId, listClass: listAllClass, listResult: listResult})
}

let getMember = (req, res) => {
    return res.render('Client_User/Member.ejs')
}

let getInformation = async (req, res) => {
    try {
        const userAccount = await userService.loadUserName();
        
        return res.render('Client_User/information.ejs', {userAccount: userAccount})
    } catch (error) {
        console.log(error);
        
    }
}

let getChangePW = async (req,res) =>{
    try {
        const userAccount = await userService.loadUserName();
        
        return res.render('Client_User/changepw.ejs', {userAccount: userAccount})
    } catch (error) {
        console.log(error);
        
    }
}


let createClass = async (req, res) => {
    const { nameDisplay } = req.body;
    if (nameDisplay) {
        try {
            const newClass = await classService.createClass(nameDisplay);
            return res.redirect(`/client/home/${newClass._id}`)
        } catch (error) {
            console.log(error);
            res.json({
                status: 'Error',
                data: error
            })
        }
    }
    else {
        console.log({
            status: 'err',
            message: "Name class must have, don't empty"
        });
    }

}

let getAllClasses = async (req, res) => {
    try {
        const listClass = await classService.getAllClass();
        res.json({
            status: 'Ok',
            data: listClass
        })
    } catch (error) {
        console.log(error);

        res.json({
            status: 'Error',
        })
    }
}

let editAccount = async(req, res) => {
    const{userName, userDate} = req.body;
    try {
        const user = await userService.editAccount(userName, userDate);
        return res.redirect('/client/information');

    } catch (error) {

    console.log(error);

    }
}

let editPassword = async(req, res) => {
    const{new_password} = req.body;
    try {
        const user = await userService.editPassword(new_password);
        return res.redirect('/client/information')
    } catch (error) {
    console.log(error);
        
    }
}


let handleUpLoadFile =  async (req, res) => {

    try {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }

        // Hiển thị ảnh đã tải lên cho người dùng kiểm tra
        res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/client/information">Upload another image</a>`);
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        res.send(err);
    }
}


module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass, getInformation, getChangePW, editAccount, editPassword, handleUpLoadFile
}
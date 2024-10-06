import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'
import jwt from '../middleware/jwtAction'
import 'dotenv/config'

let getHome = async (req, res) => {
   // Test
    // try {
    //     const listAllClass = await classService.getAllClass();
    //     return res.render('Client_User/Home.ejs', { currnetClassID: '-1', listClass: listAllClass, listExam: [] });
    // } catch (error) {
    //     console.log('error = ', error);

    // }
   // ----------------------------------------------------------
    try {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        
        const listClass = await classService.getUserClasses(IDUser);
        return res.render('Client_User/Home.ejs', { currnetClassID: '-1', listClass: listClass, listExam: [] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


let getHomeClass = async (req, res) => {
    // Lấy danh sách các lớp hiện có của user
    // const listAllClass = await classService.getAllClass();
    // let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    // const currnetClass = await classService.getCurrentClass(ClassId);
    // const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
    // return res.render('Client_User/Home.ejs', { currnetClassID: ClassId, listClass: listAllClass, listExam: listCurrentExam })
    // ----------------------------------------------------------
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    let ClassId = req.params.classID;
    try {
        const listClass = await classService.getUserClasses(IDUser);

        const currnetClass = await classService.getCurrentClass(ClassId);
        const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
        return res.render('Client_User/Home.ejs', { currnetClassID: ClassId, listClass: listClass, listExam: listCurrentExam })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

let getResult = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    // Lấy danh sách các lớp hiện có của user
    const listClass = await classService.getUserClasses(IDUser);
    let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    const currnetClass = await classService.getCurrentClass(ClassId);
    const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
    const listResult = await resultService.filterResultOfUserByExam(listCurrentExam, IDUser);
    return res.render('Client_User/Result.ejs', { currnetClassID: ClassId, listClass: listClass, listResult: listResult})
}

let getMember = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    // Lấy danh sách các lớp hiện có của user
    const listClass = await classService.getUserClasses(IDUser);
    let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    const currnetClass = await classService.getCurrentClass(ClassId);
    const listMember = await userService.getMemberInClass(currnetClass);
    return res.render('Client_User/Member.ejs',{ currnetClassID: ClassId, listClass: listClass, listMember: listMember})
}

let getInformation = (req,res) =>{
    return res.render('Client_User/information.ejs')
}

let getChangePW = (req,res) =>{
    return res.render('Client_User/changepw.ejs')
}


let createClass = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const { nameDisplay } = req.body;
    if (nameDisplay) {
        try {
            // Tạo lớp mới
            const newClass = await classService.createClass(nameDisplay);
            // Thêm lớp mới vào người dùng
            await userService.addClass(newClass._id, IDUser);
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

module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass, getInformation, getChangePW
}
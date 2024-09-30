import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'

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

let getChangePW = (req,res) =>{
    return res.render('Client_User/changepw.ejs')
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
        return res.redirect('/client/information')
    } catch (error) {
    console.log(error);
        
    }
}

module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass, getInformation, getChangePW, editAccount
}
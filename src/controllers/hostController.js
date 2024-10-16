import questionService from '../services/questionService'
import classService from '../services/classService'
import examService from '../services/examService'
import userService from '../services/userService'
import jwt from '../middleware/jwtAction'

let getCreateQuiz = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    try {
        const user = await userService.findUserbyID(IDUser);
        const easyQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Easy');   
        const mediumQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Medium');
        const hardQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Hard');
        return res.render('Host_User/createQuiz.ejs', {currnetClassID : ClassID, user: user, easyQuestion, mediumQuestion, hardQuestion})
    } catch (error) {
        console.log(error);
        
    }
   
}

let getLeaderboard = (req,res) =>{
    return res.render('Host_User/leaderboard.ejs')
}

let getManageClass = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    try {
        const user = await userService.findUserbyID(IDUser);
        const listClass = await classService.getUserClasses(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        return res.render('Host_User/manageClass.ejs', {currnetClassID : ClassID, user, listClass:listClass, currentClass: currentClass})
    } catch (error) {
        
    }

}

let getManageQuestion = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.id;
    const keyword = req.query.keyword; // Lấy từ khóa từ query string nếu có
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        let questions;
        if (keyword) {
            questions = await questionService.searchQuestionsByKeyword(ClassID, keyword);
        } else {
            // Nếu không có từ khóa, lấy tất cả câu hỏi
            questions = await questionService.getAllQuestionsByIDClass(ClassID);
        }
        const listClass = await classService.getUserClasses(IDUser);
        
        return res.render('Host_User/manageQuestion', {
            user,
            questions: questions,
            currnetClassID : ClassID,
            listClass:listClass,
            currentClass
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
};

let AddQuestion = async (req, res) => {
    const ClassID = req.params.id;
    const questionTitle = req.body.questionTitle;
    const diffculty = req.body.diffculty;
    const answers = [
        req.body.Answer1,
        req.body.Answer2,
        req.body.Answer3,
        req.body.Answer4
    ];
    
    const correctAnswers = [
        req.body.isCorrect1 || '',
        req.body.isCorrect2 || '',
        req.body.isCorrect3 || '',
        req.body.isCorrect4 || ''
    ];
    try {
        // Nếu có từ khóa tìm kiếm, tìm các câu hỏi theo từ khóa
        let questions = await questionService.AddQuestion(ClassID, questionTitle,diffculty,answers,correctAnswers);        
        return res.redirect(`/host/manageQuestion/${ClassID}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
}
let UpdateQuestion  = async (req, res) => {
    const ClassID = req.params.id;
    const questionID= req.query.questionID;
    const questionTitle = req.query.questionTitle;
    const diffculty = req.query.diffculty;
    const answers = [
        req.query.answer1,
        req.query.answer2,
        req.query.answer3,
        req.query.answer4
    ];
    const correctAnswers = [
        req.query.isCorrect1 || '',
        req.query.isCorrect2 || '',
        req.query.isCorrect3 || '',
        req.query.isCorrect4 || ''
    ];
    try {
        // Nếu có từ khóa tìm kiếm, tìm các câu hỏi theo từ khóa
        let questions = await questionService.UpdateQuestion(ClassID, questionID,questionTitle,diffculty,answers,correctAnswers);        
        return res.redirect(`/host/manageQuestion/${ClassID}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
}

let deleteQuestion= async (req,res) =>{
    const questionID = req.query.questionID;
    const classID = req.query.classID;
    
    const questionExitsInExam = await questionService.findQuestionInExam(classID, questionID);
    if(!questionExitsInExam)
        await questionService.deleteQuestionById(questionID, classID);
    else
        console.log("Không thể xóa câu hỏi đó vì có bài thi chứa câu hỏi đó !");

    return res.redirect(`/host/manageQuestion/${classID}`);
}

let deleteClass = async(req,res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    try {
        // Xóa lớp
        await classService.deleteClass(ClassID, IDUser);
        // Thêm lớp mới vào người dùng
        return res.redirect(`/client/home`)
    } catch (error) {
        console.log(error);
        res.json({
            status: 'Error',
            data: error
        })
    }

}

let updateNameClass = async(req, res) =>{
    const ClassID = req.params.idClass;
    const { newNameOfClass } = req.body;
    try {
        await classService.updateNameClass(ClassID, newNameOfClass);
        return res.redirect(`/host/manageClass/${ClassID}`)
    } catch (error) {
        console.log(error);
    }
}

let createExam = async(req,res) =>{
    const ClassID = req.params.idClass;
    let examName = req.body.examName;
    let description = req.body.description;
    let questionArray = JSON.parse(req.body.questionArray);
    try {
        await examService.createExam(examName, description, questionArray, ClassID);
        return res.redirect(`/client/home/${ClassID}`);
    } catch (error) {
        res.send(error);
    }

}

let cancelTheTest = async(req,res) =>{
    const ClassID = req.params.idClass;
    let examID = req.params.idExam;
    try {
        let currentExam = await examService.findExambyID(examID);
        if(currentExam.state==true)
            await examService.cancelTest(ClassID, examID);
        else
            console.log("Không thể hủy bài thi đã bắt đầu !!!");
            
        return res.redirect(`/client/home/${ClassID}`);
    } catch (error) {
        res.send(error);
    }

}

module.exports = {
    getCreateQuiz, getLeaderboard, getManageClass, getManageQuestion,deleteQuestion,AddQuestion,UpdateQuestion,
    deleteClass, updateNameClass, createExam, cancelTheTest
}
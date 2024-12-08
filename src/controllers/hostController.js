import questionService from '../services/questionService.js'
import classService from '../services/classService.js'
import examService from '../services/examService.js'
import userService from '../services/userService.js'
import resultService from '../services/resultService.js'
import noticeService from '../services/noticeService.js'
import jwt from '../middleware/jwtAction.js'

let getCreateQuiz = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    try {
        const user = await userService.findUserbyID(IDUser);
        const easyQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Easy');   
        const mediumQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Medium');
        const hardQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Hard');
        return res.render('Host_User/createQuiz.ejs', {currentClassID : ClassID, user: user, easyQuestion, mediumQuestion, hardQuestion})
    } catch (error) {
        console.log(error);
        
    }
   
}

let getLeaderboard = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    const examID = req.params.idExam
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        const currentExam = await examService.findExambyID(examID);
        return res.render('Host_User/leaderboard.ejs', {user, currentClass, currentExam})
    } catch (error) {
        console.log(error);
    }
    
}

let getLeaderboardHistory = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    const examID = req.params.idExam
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        const currentExam = await examService.findExambyID(examID);
        const resultOfPlayers = await resultService.getListResultByIDExam(examID);
        return res.render('Host_User/leaderboard_history.ejs', {user, currentClass, currentExam, resultOfPlayers})
    } catch (error) {
        console.log(error);
        
    }
}

let getManageClass = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    try {
        const user = await userService.findUserbyID(IDUser);
        const listClass = await classService.getUserClasses(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        const notice = await noticeService.getAllNoticeByClassID(ClassID);
        return res.render('Host_User/manageClass.ejs', {currentClassID : ClassID, user, page: 'caidat',notice:notice,listClass:listClass, currentClass: currentClass})
    } catch (error) {
        console.log(error);
        
    }

}

let getManageQuestion = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    const keyword = req.query.keyword; // Lấy từ khóa từ query string nếu có
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentClass = await classService.getCurrentClass(ClassID);
        const notice = await noticeService.getAllNoticeByClassID(ClassID)
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
            page: 'cauhoi',
            currentClassID : ClassID,
            listClass:listClass,
            currentClass,
            notice:notice
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
};

let AddQuestion = async (req, res) => {
    const ClassID = req.params.idClass;
    const questionTitle = req.body.questionTitle;
    const diffculty = req.body.diffculty;
    const answers = [
        req.body.Answer1 || '',
        req.body.Answer2 || '',
        req.body.Answer3 || '',
        req.body.Answer4 || ''
    ].filter(answer => answer !== '');
    
    console.log(answers)
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
        req.query.answer1||'',
        req.query.answer2||'',
        req.query.answer3||'',
        req.query.answer4||''
    ].filter(answer => answer !== '');
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

let deleteQuestion = async (req, res) => {
    const { questionID, classID } = req.query;

    try {
        const questionExistsInExam = await questionService.findQuestionInExam(classID, questionID);

        if (!questionExistsInExam) {
            await questionService.deleteQuestionById(questionID, classID);
            return res.status(200).json({ success: true, message: 'Xóa câu hỏi thành công' });
        } else {
            return res.status(400).json({ success: false, message: 'Không thể xóa câu hỏi vì có bài thi chứa câu hỏi đó!' });
        }
    } catch (error) {
        console.error('Lỗi khi xóa câu hỏi:', error);
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa câu hỏi' });
    }
};


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
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    let examName = req.body.examName;
    let description = req.body.description;
    let questionArray = JSON.parse(req.body.questionArray);
    try {
        await examService.createExam(examName, description, questionArray, ClassID, IDUser);
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
        if(currentExam.state=='Open')
            await examService.cancelTest(ClassID, examID);
        else
            console.log("Không thể hủy bài thi đã bắt đầu !!!");
            
        return res.redirect(`/client/home/${ClassID}`);
    } catch (error) {
        res.send(error);
    }

}


export default  {
    getCreateQuiz, getLeaderboard, getLeaderboardHistory, getManageClass, getManageQuestion,deleteQuestion,AddQuestion,UpdateQuestion,
    deleteClass, updateNameClass, createExam, cancelTheTest
}
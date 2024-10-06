import questionService from '../services/questionService'
import classService from '../services/classService'
import jwt from '../middleware/jwtAction'

let getCreateQuiz = async (req,res) =>{
    const ClassID = req.params.idClass;
    const easyQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Easy');   
    const mediumQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Medium');
    const hardQuestion = await questionService.filterQuestionByDifficulty(ClassID, 'Hard');

    return res.render('Host_User/createQuiz.ejs', {currnetClassID : ClassID, easyQuestion, mediumQuestion, hardQuestion})
}

let getLeaderboard = (req,res) =>{
    return res.render('Host_User/leaderboard.ejs')
}

let getManageClass = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.idClass;
    const listClass = await classService.getUserClasses(IDUser);
    const currentClass = await classService.getCurrentClass(ClassID);
    return res.render('Host_User/manageClass.ejs', {currnetClassID : ClassID, listClass:listClass, currentClass: currentClass})
}
let deleteQuestion= async (req,res) =>{
    const questionID = req.query.questionID;
    const classID = req.query.classID;
    questionService.deleteQuestionById(questionID, classID);
    const questions = await questionService.getAllQuestionsByIDClass(classID);
    return res.redirect(`/host/manageQuestion/${classID}`);
}
let getManageQuestion = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassID = req.params.id;
    const keyword = req.query.keyword; // Lấy từ khóa từ query string nếu có
    try {
        let questions;
        if (keyword) {
            questions = await questionService.searchQuestionsByKeyword(ClassID, keyword);
        } else {
            // Nếu không có từ khóa, lấy tất cả câu hỏi
            questions = await questionService.getAllQuestionsByIDClass(ClassID);
        }
        const listClass = await classService.getUserClasses(IDUser);
        
        return res.render('Host_User/manageQuestion', {
            questions: questions,
            currnetClassID : ClassID,
            listClass:listClass
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

module.exports = {
    getCreateQuiz, getLeaderboard, getManageClass, getManageQuestion,deleteQuestion,AddQuestion,UpdateQuestion,
    deleteClass, updateNameClass
}
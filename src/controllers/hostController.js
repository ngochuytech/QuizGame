import questionService from '../services/questionService'
import classService from '../services/classService'
import examService from '../services/examService'

let getCreateQuiz = (req,res) =>{
    return res.render('Host_User/createQuiz.ejs')
}

let getLeaderboard = (req,res) =>{
    return res.render('Host_User/leaderboard.ejs')
}

let getManageClass = (req,res) =>{
    return res.render('Host_User/manageClass.ejs')
}
let deleteQuestion= async (req,res) =>{
    const questionID = req.query.questionID;
    const classID = req.query.classID;
    questionService.deleteQuestionById(questionID);
    const questions = await questionService.getAllQuestionsByIDClass(classID);
    return res.redirect(`/host/manageQuestion/${classID}`);
}
let getManageQuestion = async (req, res) => {
    const ClassID = req.params.id;
    const keyword = req.query.keyword; // Lấy từ khóa từ query string nếu có

    console.log('Current Class ID:', ClassID);
    console.log('Keyword:', keyword);

    try {
        let questions;
        if (keyword) {
            questions = await questionService.searchQuestionsByKeyword(ClassID, keyword);
        } else {
            // Nếu không có từ khóa, lấy tất cả câu hỏi
            questions = await questionService.getAllQuestionsByIDClass(ClassID);
        }
        const listAllClass = await classService.getAllClass();
        const currnetClass = await classService.getCurrentClass(ClassID);
        
        return res.render('Host_User/manageQuestion', {
            question: questions,
            currnetClassID : ClassID,
            listClass:listAllClass
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

module.exports = {
    getCreateQuiz, getLeaderboard, getManageClass, getManageQuestion,deleteQuestion,AddQuestion
}
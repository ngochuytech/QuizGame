import classService from '../services/classService'
import examService from '../services/examService'
import jwt from "./jwtAction";
const checkStateExam = async (req, res, next) => {
    const idExam = req.params.examID;
    const idClass = req.params.classID;
    try {
        const currentExam = await examService.findExambyID(idExam);
        if(currentExam.state != 'Open')
            return res.redirect(`/client/home/${idClass}`)
        next();
    } catch (error) {
        console.log(error);
    }
    
};

const filterUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassId = req.params.classID;
    
    try {
        const classCheck = await classService.getCurrentClass(ClassId);
        
        if(classCheck.members.indexOf(IDUser) == -1 && classCheck.ownerID != IDUser){ 
            return res.redirect('/client/home');
        }
        next();
    } catch (error) {
        console.log("Error at FilterUser Middleware" + error);
    }
};


module.exports = {
    checkStateExam, filterUser
}
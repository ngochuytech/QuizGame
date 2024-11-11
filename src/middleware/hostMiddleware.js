import examService from '../services/examService'

const checkStateExam = async (req, res, next) => {
    const ExamID = req.params.idExam;
    const ClassID = req.params.idClass;
    try {
        const currentExam = await examService.findExambyID(ExamID);
        if(currentExam.state == 'Open')
            return res.redirect(`/client/home/${ClassID}`)
        next();
    } catch (error) {
        console.log(error);
    }
    
};

module.exports = {
    checkStateExam
}
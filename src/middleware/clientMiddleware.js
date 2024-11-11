import examService from '../services/examService'

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

module.exports = {
    checkStateExam
}
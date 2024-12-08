import examService from '../services/examService.js'

const checkStateExam = async (req, res, next) => {
    const ExamID = req.params.idExam;
    const ClassID = req.params.idClass;
    try {
        const currentExam = await examService.findExambyID(ExamID);
        if(currentExam.state == 'Open')
            return res.redirect(`/client/home/${ClassID}`)
        else if(currentExam.state == 'Closed')
            return res.redirect(`/host/leaderboardHistory/${ClassID}/${ExamID}`);
        next();
    } catch (error) {
        console.log(error);
    }
    
};

const filterUser = async(req,res,next) =>
    {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        const ClassID = req.params.classID;
    
        try {
            const classCheck = await classService.getCurrentClass(ClassID);
            if(classCheck.members.indexOf(IDUser)==-1 && classCheck.ownerID!=IDUser)
            {
                return res.redirect('/client/home');
            }
            next();
        } catch (error) {
            console.log("Error at FilterUser Middleware"+error);
        }
    }
    
    export default  {
        checkStateExam,filterUser
    }
import { Questions } from '../models/questionModel'
import { Class } from '../models/classModel';
import { Exam } from '../models/examModel';
const getAllQuestions = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const Question = await Questions.find({});
            resolve(Question)
        } catch (error) {
            reject(error)
        }
    })
}
const getAllQuestionsByIDClass = (ClassID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let question = await Questions.find({classID: ClassID})           
            resolve(question)
        } catch (error) {
            reject(error)
        }
    })
}
const deleteQuestionById = async (QuestionID, classID) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Xoá câu hỏi đó ra khỏi lớp
            const updatedClass = await Class.findByIdAndUpdate(classID, {$pull: {questions: QuestionID}});
            // Xóa câu hỏi đó ra khỏi bài thi trong lớp đó
            for(let examItem of updatedClass.Exams){
                await Exam.findByIdAndUpdate(examItem,{
                    $pull :{questions: QuestionID}
                })
            }
            // Xóa câu hỏi ở Model
            const questionHasDelete = await Questions.deleteOne({ _id: QuestionID });
            resolve(questionHasDelete);
        } catch (error) {
            reject(error)
        }
    })
}
const searchQuestionsByKeyword = (ClassID, keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm câu hỏi có thuộc tính 'questionText' chứa 'keyword'
            const questions = await Questions.find({
                classID: ClassID,
                question: { $regex: keyword, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
            });
            resolve(questions);
        } catch (error) {
            reject(error);
        }
    });
};
const AddQuestion = async (ClassID, questionTitle, difficulty, answers, correctAnswers) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Answers = [];
            for (let i = 0; i < answers.length; i++) {
                Answers.push({ text: answers[i], isCorrect: correctAnswers[i] ? true : false });
            }
                
            const question = await Questions.create({
                classID: ClassID,
                question: questionTitle,
                difficulty: difficulty,
                answer: Answers 
            });
            await Class.findByIdAndUpdate(ClassID, {$push: { questions: question._id}})
            resolve(question)
        } catch (error) {
            console.error('Lỗi khi thêm câu hỏi:', error);
            reject(error)
        }
    })
};
const UpdateQuestion = async (ClassID, QuestionID,questionTitle, difficulty, answers, correctAnswers) => {
    try {
        const Answers = [];
        for (let i = 0; i < answers.length; i++) {
            Answers.push({ text: answers[i], isCorrect: correctAnswers[i] ? true : false });
        }
        const question = await Questions.replaceOne(
            { _id: QuestionID},
            {
                classID: ClassID,
                question: questionTitle,
                difficulty: difficulty,
                answer: Answers 
            }
        );

    } catch (error) {
        console.error('Lỗi khi update câu hỏi:', error);
        throw error;
    }
}

const filterQuestionByDifficulty = async (ClassID, Difficulty)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const question = await Questions.find({classID: ClassID, difficulty: Difficulty}); 
            resolve(question)
        } catch (error) {
            reject(error)
        }
    })
}

// Lấy số lượng câu hỏi theo độ khó (Phục vụ cho trang WaitingRoom)
const getNumberOfQuestionByDiffculty = async (exam) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let easySize = 0, mediumSize = 0, hardSize = 0;
            for(let questionID of exam.questions) {
                let item = await Questions.findById(questionID);
                if(item.difficulty == 'Easy')
                    easySize++;
                else if(item.difficulty == 'Medium')
                    mediumSize++;
                else
                    hardSize++;
            }
            let result = { easySize, mediumSize, hardSize };
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

// Tìm kiếm câu hỏi đó có trong bài thi nào không ?
const findQuestionInExam = async(ClassID, questionID) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const thisClass = await Class.findById(ClassID);
            for(let examID of thisClass.Exams){
                let item = await Exam.findOne({_id: examID, questions: questionID})
                if(item)
                    return resolve(item);
            }
            resolve(null);
        } catch (error) {
            reject(error)
        }
    })
}

// Lọc những câu hỏi theo bài thi
const filterQuestionByExam = async(currentExam) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const listQuestion = await Questions.find({_id: {$in: currentExam.questions}})   
            resolve(listQuestion);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getAllQuestions,getAllQuestionsByIDClass,searchQuestionsByKeyword,deleteQuestionById,AddQuestion,UpdateQuestion,
    filterQuestionByDifficulty, getNumberOfQuestionByDiffculty, findQuestionInExam, filterQuestionByExam
}

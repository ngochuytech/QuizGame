import { Questions } from '../models/questionModel'

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
            const Question = await Questions.find({ classID: ClassID });
            resolve(Question)
        } catch (error) {
            reject(error)
        }
    })
}
const deleteQuestionById = async (QuestionID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Question = await Questions.deleteOne({ _id: QuestionID });
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
    try {
        const Answers = [
            { text: answers[0], isCorrect: correctAnswers[0] ? true : false },
            { text: answers[1], isCorrect: correctAnswers[1] ? true : false },
            { text: answers[2], isCorrect: correctAnswers[2] ? true : false },
            { text: answers[3], isCorrect: correctAnswers[3] ? true : false }
        ];
        
        const question = await Questions.create({
            classID: ClassID,
            question: questionTitle,
            difficulty: difficulty,
            answer: Answers 
        });

        console.log('Thêm câu hỏi thành công',question);
    } catch (error) {
        console.error('Lỗi khi thêm câu hỏi:', error);
        throw error;
    }
};

module.exports = {
    getAllQuestions,getAllQuestionsByIDClass,searchQuestionsByKeyword,deleteQuestionById,AddQuestion
}

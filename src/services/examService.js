import { Exam } from '../models/examModel'

const filterExamByClass = (ExamIDfromClass) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listExam = await Exam.find({_id:ExamIDfromClass});
            resolve(listExam)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterExamByClass
}
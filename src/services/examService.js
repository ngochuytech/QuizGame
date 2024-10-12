import { Exam } from '../models/examModel'
import { Class } from '../models/classModel'
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

// Hàm tạo bài thi mới
const createExam = (nameExam, descriptionExam, questionArray, ClassID) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tạo bài thi mới
            const newExam = await Exam.create({
                nameDisplay: nameExam,
                description: descriptionExam,
                questions: questionArray
            })
            // Cập nhật exam này vào class tương ứng
            const updateExamIntoClass = await Class.findByIdAndUpdate(
                ClassID,
                {
                    $push: {Exams: newExam._id}
                }
            )
            resolve(newExam);
        } catch (error) {
            reject(error)
        }
    })
}

// Hàm tìm bài thi từ ID
const findExambyID = (ExamID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const exam = Exam.findById(ExamID);
            resolve(exam);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterExamByClass, createExam, findExambyID
}
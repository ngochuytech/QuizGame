import { Exam } from '../models/examModel.js'
import { Class } from '../models/classModel.js'
import userService from '../services/userService.js'
import { Result } from '../models/resultModel.js'
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
const createExam = (nameExam, descriptionExam, questionArray, ClassID, IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await userService.findUserbyID(IDUser);
            const creator = { idCreator: user._id, nameCreator: user.nameDisplay}
            // Tạo bài thi mới
            const newExam = await Exam.create({
                nameDisplay: nameExam,
                description: descriptionExam,
                questions: questionArray,
                creator: creator
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

// Hủy bài thi trong trạng thái chưa bắt đầu (Đang mở)
const cancelTest = (ClassID, ExamID)=>{
    return new Promise(async (resolve, reject) => {
        try {
            // Xoá bài thi ra khỏi lớp
            await Class.findByIdAndUpdate(ClassID,
                {$pull: {Exams: ExamID}}
            )
            // Xóa các kết quả của bài thi này
            await Result.deleteMany({examID: ExamID});
            // Xóa bài thi ra khỏi model
            await Exam.deleteOne({_id: ExamID});
            resolve();
        } catch (error) {
            reject(error)
        }
    })
}

const updateState = (idExam, State)=>{
    return new Promise(async(resolve, reject)=>{
        try { 
            await Exam.findByIdAndUpdate(idExam, {state: State});
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

const checkStateExam = (idExam) => {
    return new Promise(async(resolve, reject)=>{
        try { 
            const exam = await Exam.findById(idExam);
            resolve(exam.state);
        } catch (error) {
            reject(error);
        }
    })
}

export default  {
    createExam, findExambyID, cancelTest, filterExamByClass, updateState, checkStateExam
}
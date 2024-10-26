import { Exam } from '../models/examModel';
import { Result } from '../models/resultModel'
const filterResultByExam = (listExam) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listResult = [];
            for(let i=0; i<listExam.length; i++){
                const item = await Result.find({examID: listExam[i]._id});
                listResult.push(item);
            }  
            resolve(listResult);
        } catch (error) {
            reject(error)
        }
    })
}

// Tìm kết quả của người dùng cụ thể
const findResultsByUser = (IDUser, currentClass) =>{
    return new Promise(async (resolve, reject) => {
        try {
            // Chứa kết quả của người dùng IDUser đó
            const resultOfUser = [];
            // Chứa bài thi của người dùng IDUser đó
            const examOfUser = [];
            const listExam = await Exam.find({_id: {$in: currentClass.Exams}});
            for(let examDetail of listExam){
                let item = await Result.findOne({_id :{$in: examDetail.results}, particantID: IDUser});
                if(item!=null){
                    resultOfUser.push(item);
                    let itemExam = await Exam.findById(item.examID);
                    examOfUser.push(itemExam);
                }
                   
            }
            resolve({resultOfUser, examOfUser});
        } catch (error) {
            reject(error)
        }
    })
}

// Lưu kết quả khi người dùng thi xong
const saveResult = (examID, userID, score) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newResult = await Result.create({
                examID,
                particantID: userID,
                grade: score
            })

            await Exam.findByIdAndUpdate(examID, {
                $push: {results: newResult._id}
            })
            resolve(newResult);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterResultByExam, findResultsByUser, saveResult
}
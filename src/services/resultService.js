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

const filterResultOfUserByExam = (listExam, idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listResult = [];
            for(let i=0; i<listExam.length; i++){
                const item = await Result.find({particantID: idUser , examID: listExam[i]._id});
                listResult.push(item);
            }  
            resolve(listResult);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterResultByExam, filterResultOfUserByExam
}
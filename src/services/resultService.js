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

const findResultsByUser = (IDUser) =>{
    return new Promise(async (resolve, reject) => {
        try {
            // Result nên có classID !!!
            const listResult = await Result.find({particantID: IDUser});
            resolve(listResult);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterResultByExam, findResultsByUser
}
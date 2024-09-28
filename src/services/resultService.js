import { Result } from '../models/resultModel'

const filterResultByExam = (listExam) => {
    return new Promise(async (resolve, reject) => {
        try {
            const listResult = [];
            for(let i=0; i<listExam.length; i++){
                console.log(listExam[i]._id);
                
                const item = await Result.find({examID: listExam[i]._id});
                listResult.push(item);
            }
            console.log(listResult);
            
            resolve(listResult);
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    filterResultByExam
}
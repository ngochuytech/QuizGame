import mongoose from "mongoose";
import { Class } from '../models/classModel';
import { Questions } from "../models/questionModel";
import { Exam } from '../models/examModel'
import { Results} from '../models/resultModel'
const createClass = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const newClass = await Class.create({
                _id: new mongoose.Types.ObjectId(),
                nameDisplay: "Geography Class1"
            });
            const newQuestion1 = await Questions.create({
                classID: newClass,
                question: 'What is your name',
                answer: [{text: '1. Huy', isCorrect: true}, {text: '2. Thanh'}, {text: '3.Client'}, {text: '4. Host'}]
            });
            const newQuestion2 = await Questions.create({
                classID: newClass,
                question: 'What is your name',
                answer: [{text: '1. Huy', isCorrect: true}, {text: '2. Thanh'}, {text: '3.Client'}, {text: '4. Host'}]
            });
            const newExam = await Exam.create({
                nameDisplay: 'Bài thi số 1',
                description: 'Test thử',
                questions: [newQuestion1,newQuestion2],
                particantsID: [],
                results: [],
                createAt: Date.now()
            })
            console.log('Class and questions created successfully');
            resolve(newClass)

        } catch (error) {
            reject(error)
        }
    })
}

module.exports ={
    createClass
}
import mongoose from "mongoose";
import { Class } from '../models/classModel';

const createClass = ({ }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newClass = await Class.create({
                _id: new mongoose.Types.ObjectId(),
                nameDisplay: "Geography Class1",
                description: "This is a geography class.",
            });
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
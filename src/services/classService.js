import mongoose from "mongoose";
import { Class } from '../models/classModel';
import { User } from '../models/userModel';

const createClass = (nameClass) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newClass = await Class.create({
                _id: new mongoose.Types.ObjectId(),
                nameDisplay: nameClass
            });
            console.log('Class and questions created successfully');
            resolve(newClass)

        } catch (error) {
            reject(error)
        }
    })
}

// Lấy danh sách các lớp hiện có
const getAllClass = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listClass = await Class.find({});
            resolve(listClass)
        } catch (error) {
            reject(error)
        }
    })
}

const getCurrentClass = (ClassID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const currnetClass = await Class.findById(ClassID);
            resolve(currnetClass)
        } catch (error) {
            reject(error)
        }
    })
}
const getUserClasses = async (userId) => {
    console.log(userId)
        try {
            const user = await User.findById(userId).populate('MyClassId').exec();
            console.log(user)
            // if (!user) {
            //     return new Error('User not found');
            // }
            const classes = user.MyClassId;   // Lấy danh sách _id của các lớp
            return classes;
        } catch (error) {
            return error;
        }
};



module.exports ={
    createClass, getAllClass, getCurrentClass,getUserClasses
}
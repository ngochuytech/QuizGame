import mongoose from "mongoose";
import { Class } from '../models/classModel';
import userService from '../services/userService';

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

// Lấy lớp hiện tại thông qua id của lớp đó
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

// Lấy danh sách lớp của user cụ thể
const getUserClasses = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await userService.findUserbyID(userId);
            const classOfUser = await Class.find({_id: user.MyClassId});
            resolve(classOfUser)
        } catch (error) {
            reject(error)
        }
    })
};



module.exports ={
    createClass, getAllClass, getCurrentClass,getUserClasses
}
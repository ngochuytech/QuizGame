import mongoose from "mongoose";
import { Class } from '../models/classModel';
import { Questions } from '../models/questionModel'
import userService from '../services/userService';

const createClass = (nameClass,IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newClass = await Class.create({
                _id: new mongoose.Types.ObjectId(),
                ownerID:IDUser,
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
        } catch (error) {Z
            reject(error)
        }
    })
}

// Lấy danh sách lớp của user cụ thể
const getUserClasses = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await userService.findUserbyID(userId);
            const classOfUserNotOwner = await Class.find({_id: user.MyClassId}); // class mà user chỉ là thành viên không phải người tạo
            const classOfUserOnwer = await Class.find({ownerID: user._id});// class mà user là người tạo
            const all = classOfUserNotOwner.concat(classOfUserOnwer);
            resolve(all)
        } catch (error) {
            reject(error)
        }
    })
};

const deleteClass = async (ClassID, IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Xóa lớp được lưu ở người dùng
            await userService.deleteClass(ClassID, IDUser);
            // Xoá các câu hỏi trong lớp đó và trong CSDL (QuesitonModel)
            await Questions.deleteMany({classID: ClassID})

            const deleteclass = await Class.deleteOne({_id: ClassID});
            resolve(deleteclass)
        } catch (error) {
            reject(error)
        }
    })
}

const updateNameClass = async (ClassID, newNameOfClass) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newClass = await Class.findByIdAndUpdate(ClassID, {nameDisplay: newNameOfClass});
            resolve(newClass);
        } catch (error) {
            reject(error)
        }
    })
}


module.exports ={
    createClass, getAllClass, getCurrentClass,getUserClasses, deleteClass, updateNameClass
}
import mongoose from "mongoose";
import { Class } from '../models/classModel';
import { Questions } from '../models/questionModel'
import { User } from '../models/userModel'
import { Exam } from '../models/examModel'
import { Result } from '../models/resultModel'
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
            const classToDelete = await Class.findById(ClassID);
            // Xoá các thành viên trong lớp
            await User.updateMany(
                { MyClassId: ClassID },
                { $pull: {MyClassId: ClassID} }
            )
            // Xoá các câu hỏi trong lớp đó và trong CSDL (QuesitonModel)
            await Questions.deleteMany({classID: ClassID})
            // Xóa cái bài thi có trong lớp
            await Exam.deleteMany({_id: {$in: classToDelete.Exams}});
            // Xóa các kết quả của các bài thi trong lớp (CHƯA CHECK !!!)
            await Result.deleteMany({examID: {$in: classToDelete.Exams}})
            // Xóa lớp
            const deleteclass = await Class.deleteOne({_id: ClassID});
            resolve(deleteclass)
        } catch (error) {
            console.log('deleteClass in ClassService error = ', error); 
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
const deleteMember = async (classId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Xóa thành viên ra khỏi lớp
            const updatedClass = await Class.findByIdAndUpdate(
                classId,
                { $pull: { members: userId } }
            );
            // Xóa class đó trong User (MyclassID)
            await User.findByIdAndUpdate(
                userId,
                { $pull: {MyClassId: classId}}
            );
            resolve(updatedClass);
        } catch (error) {
            console.error("Error removing member:", error);
            reject(error)
        }
    });
};

// Thêm 1 thành viên mới vào class
const addMember = async (classID, idMember) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Thêm thành viên vào class
            await Class.findByIdAndUpdate(
                classID,
                { $push: { members: idMember } }
            );
            // Thêm class vào user đó
            await User.findByIdAndUpdate(
                idMember,
                { $push: {MyClassId: classID} }
            )
            resolve();
        } catch (error) {
            reject(error)
        }
    });
}

module.exports ={
    createClass, getAllClass, getCurrentClass,getUserClasses, deleteClass, updateNameClass,deleteMember,addMember
}
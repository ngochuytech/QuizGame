import mongoose from "mongoose";
import { User } from '../models/userModel';

const createUserService = ({ accountName, password}) =>{
    return new Promise(async (resolve, reject) => {
        try {
            
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(accountName)
            if(isEmail){
                const checkEmail = await User.find({accountName: accountName})
                if(checkEmail.length){
                    reject({
                        status: 'err',
                        message: "Duplicate email"
                    })
                }
                const newUser = await User.create({
                    _id: new mongoose.Types.ObjectId(),
                    nameDisplay: accountName,
                    accountName: accountName,
                    password
                })
                resolve(newUser);
            }
            else{
                reject({
                    status: 'err',
                    message: 'Account name is not a email'
                })
            }
        } catch (error) {
            reject({
                status: 'err',
                data: error
                
            })
        }
    });
}

let loginUserService = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({accountName: email, password: password});
            if(checkUser!=null){
                resolve(checkUser._id)
            }
            resolve(null)
        } catch (error) {
            reject({
                message: error,
                status: 'err'
            })
        }
    })
}
const getMemberInClass = (Class) => {
    return new Promise(async (resolve, reject) => {
        try {
            const members = [];
            // Chủ phòng
            const owner = await User.findOne({MyClassId: Class._id});
            members.push(owner);
            // Thành viên
            for(let i=0; i<Class.members.length; i++){
                const item = await User.findById(Class.members[i]._id);
                members.push(item);
            }      
            resolve(members)

        } catch (error) {
            reject(error)
        }
    })
}

let getIDbyEmailAndPassWord = ({ accountName, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ accountName: accountName, password: password });
            if(user)
                resolve(user._id);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Cập nhật thông tin lớp của user khi được tạo 1 lớp mới
let addClass = (idClass, idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate(idUser,  {$push: { MyClassId: idClass }});
            if(user)
                resolve(user);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Cập nhật thông tin lớp của user khi được xoá 1 lớp 
let deleteClass = (idClass, idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate(idUser,  {$pull: { MyClassId: idClass }});
            if(user)
                resolve(user);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Tìm User bằng ID
let findUserbyID = (IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: IDUser });
            if(user)
                resolve(user);
            }
        catch (error) {
            reject(error)
        }
    })   
}
module.exports = {
    createUserService, loginUserService,getMemberInClass, getIDbyEmailAndPassWord, findUserbyID, addClass,
    deleteClass
}
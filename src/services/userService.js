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

let loginUserService = ({ accountName, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.find({accountName: accountName, password: password});
            if(checkUser.length){
                resolve({
                    status: 'Ok',
                    message: "Login is successful"
                })
            }
            else{
                resolve({
                    status: 'err',
                    message: 'AccountName or Password is not correct, please try again'
                })
            }

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
            const owner = await User.findById({_id: Class.ownerID});
            members.push(owner);
            // Thành viên
            for(let i=0; i<Class.members.length; i++){
                const item = await User.findById({_id: Class.members[i]._id});
                members.push(item);
            }      
            resolve(members)

        } catch (error) {
            reject(error)
        }
    })
}



module.exports = {
    createUserService, loginUserService, getMemberInClass
}
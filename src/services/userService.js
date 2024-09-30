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

const loadUserName = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.find({_id: '66f37706ebb8f99f8ec8baf5' });
            if(!user){
                return reject(new Error('The user is not exist.'));   
            }
            resolve(user);

        } catch (error) {
            reject({
                message: 'Could not load the user information',
                status: 'err'
            })
        }

    })
}

const editAccount = (userName, userDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate( '66f37706ebb8f99f8ec8baf5', {
                nameDisplay: userName,
                date: userDate
             } )
            resolve(user);

        } catch (error) {
            reject({
                message: 'Could not load the user information',
                status: 'err'
            })
        }

    })
}

module.exports = {
    createUserService, loginUserService, loadUserName, editAccount
}
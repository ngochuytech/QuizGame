import { User } from '../models/userModel'

export const createUserService = ({ accountName, password, repeat_password }) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(accountName)
            if(isEmail){
                const checkEmail = await User.find({accountName: accountName})
                if(checkEmail.length){
                    resolve({
                        status: 'err',
                        message: "Duplicate email"
                    })
                }
                const newUser = await User.create({
                    nameDisplay: accountName,
                    accountName: accountName,
                    password
                })
                resolve({
                    status: 'OK',
                    data: newUser
                })
            }
            else{
                resolve({
                    status: 'err',
                    data: 'Account name is not a email'
                })
            }
        } catch (error) {
            reject({
                message: error,
                status: 'err'
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

module.exports = {
    createUserService, loginUserService
}
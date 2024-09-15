import {User} from '../models/userModel'

let getLogin = (req,res)=>{
    return res.render('login.ejs')
}

let getRegister = (req,res)=>{
    return res.render('register.ejs')
}

let Home = (req,res)=>{
    console.log("req = ", req.query);
    
    return res.send('Home');
}

let createUser = async (req,res)=>{
    const {accountName, password, repeat_password} = req.body;
    try {
        if(accountName && password && repeat_password){
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(accountName)
            if(isEmail){
                const checkEmail = await User.find({accountName: accountName})
                
                if(checkEmail.length){
                    return res.json({
                        status: 'err',
                        message: "Duplicate email"
                    })
                }
                const newUser = await User.create({
                    name: accountName,
                    accountName: accountName,
                    password
                })
                return res.json({
                    status: 'OK',
                    data: newUser
                })
            }

        }else{
            return res.json({
                status: 'err',
                message: "The email and password is required"
            })
        }

    } catch (error) {
        console.log(error);
        return res.json({
            status: 'err',
            message: error
        })
        
    }
    
    return res.send("Success")
}

// In 'module.exports', you have a getInformation function. You can put more functions to export
module.exports = {
    getLogin, getRegister, Home, createUser
}
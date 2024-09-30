import userService from '../services/userService'

let getLogin = (req, res) => {
    return res.render('login.ejs')
}

let getRegister = (req, res) => {
    return res.render('register.ejs')
}

let Home = (req, res) => {
    console.log("req = ", req.query);
    return res.send('Home');
}

let createUser = async (req, res) => {
    const { accountName, password, repeat_password } = req.body;
    if (accountName && password) {
        if(password === repeat_password){
            try {
                const NewUser = await userService.createUserService({ accountName, password })
                console.log(NewUser);
                console.log("Create successful users");
                return res.redirect('/user/login');
            } catch (error) {
                console.log(error);
                return res.redirect('/user/register');
            }
        }
        else{
            console.log({
                status: 'err',
                message: "Password and repeat_password is not same"
            });
            return res.redirect('/user/register');
        }


    } else {
        console.log({
            status: 'err',
            message: "The email and password is required"
        });
        return res.redirect('/user/register');
    }
}

let loginUser = async(req, res) =>{
    const { email, password } = req.body;
    
    if(email && password){
        const user = await userService.loginUserService({email, password})
        return res.redirect('/client/Home')
    }
    else{
        return res.json({
            status: 'err',
            message: 'AccountName and Password is required'
        })
    }
}



// In 'module.exports', you have a getInformation function. You can put more functions to export
module.exports = {
    getLogin, getRegister, Home, createUser, loginUser
}
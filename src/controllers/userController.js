import userService from '../services/userService'
import jwt from '../middleware/jwtAction'
import 'dotenv/config'


let getLogin = (req, res) => {
    const token = req.cookies.jwt;
    if(token)
    {
        res.redirect('/client/Home');
    }
    else
    {
        return res.render('login.ejs')
    }
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
        try {
            const { email, password } = req.body;
        
            if (email && password) {
            const user = await userService.loginUserService({ email, password });
              // Lấy id_user dựa trên email và password
              if (user==null) {
                // Nếu không tìm thấy user, trả về lỗi
                return res.status(401).json({ message: 'Invalid credentials' });
              }
              // Tạo JWT token
              const token = jwt.createJWT({_id: user._id});
              
              // Gửi token qua cookie
              res.cookie('jwt', token, { httpOnly: true, secure: false});
    
              // Chuyển hướng về trang home
              return res.redirect('/client/Home');
            } 
            else {
              // Thiếu email hoặc password
              return res.json({
                status: 'err',
                message: 'AccountName and Password is required'
            })
            }
          } catch (error) {
            // Bắt và xử lý lỗi
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
          }
    }    
module.exports = {
    getLogin, getRegister, Home, createUser, loginUser
}
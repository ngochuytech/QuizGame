import jwt from "./jwtAction.js";
const AuthRequired = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        console.log("Chưa đăng nhập, ko được vào");        
        return res.redirect("/user/login");
    }
    const decode= jwt.verifyToken(token);
    
    if (!decode || !decode.exp) {
        console.log("Token không hợp lệ, cần đăng nhập lại");
        res.clearCookie('jwt');
        return res.redirect("/user/login");
    }
    next();
};

export default  {
    AuthRequired
}
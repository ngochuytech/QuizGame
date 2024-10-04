const AuthRequired = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        console.log("Chưa đăng nhập, ko được vào");        
        return res.redirect("/user/login");
    }
    next();
};

module.exports = {
    AuthRequired
}
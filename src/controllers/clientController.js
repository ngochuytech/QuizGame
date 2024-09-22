let getHome = (req,res)=>{
    return res.render('Client_User/Home.ejs')
}

let getResult = (req,res)=>{
    return res.render('Client_User/Result.ejs')
}

let getMember = (req,res)=>{
    return res.render('Client_User/Member.ejs')
}
module.exports = {
    getHome, getResult, getMember
}
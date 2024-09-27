let getCreateQuiz = (req,res) =>{
    return res.render('Host_User/createQuiz.ejs')
}

let getLeaderboard = (req,res) =>{
    return res.render('Host_User/leaderboard.ejs')
}

let getManageClass = (req,res) =>{
    return res.render('Host_User/manageClass.ejs')
}

let getManageQuestion = (req,res) =>{
    return res.render('Host_User/manageQuestion.ejs')
}


module.exports = {
    getCreateQuiz, getLeaderboard, getManageClass, getManageQuestion
}
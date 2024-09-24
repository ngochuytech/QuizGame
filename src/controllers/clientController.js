import clientService from '../services/clientService'

let getHome = (req, res) => {
    return res.render('Client_User/Home.ejs')
}

let getResult = (req, res) => {
    return res.render('Client_User/Result.ejs')
}

let getMember = (req, res) => {
    return res.render('Client_User/Member.ejs')
}

let createClass = async (req, res) => {
    try {
        const newClass = await clientService.createClass();
        res.json({
            status: 'Ok',
            data: newClass
        })
    } catch (error) {
        console.log(error);
        
       res.json({
            status: 'Error',
            data: error
       })
    }

}

module.exports = {
    getHome, getResult, getMember, createClass
}
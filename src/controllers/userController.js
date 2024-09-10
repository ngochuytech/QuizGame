let getInformation = (req,res)=>{
    return res.render('index.ejs')
}
// In 'module.exports', you have a getInformation function. You can put more functions to export
module.exports = {
    getInformation
}
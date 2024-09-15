import express from "express"

const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Client Home")
})

router.get('/about',(req,res)=>{
    res.send("Client about")
})


module.exports = router;
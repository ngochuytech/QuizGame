import mongoose from 'mongoose'
import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'
import jwt from '../middleware/jwtAction'
import 'dotenv/config'
import multer from 'multer'

let getHome = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        
        const listClass = await classService.getUserClasses(IDUser);
        return res.render('Client_User/Home.ejs', { currnetClassID: '-1', listClass: listClass, listExam: [] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


let getHomeClass = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    let ClassId = req.params.classID;
    try {
        const listClass = await classService.getUserClasses(IDUser);

        const currnetClass = await classService.getCurrentClass(ClassId);
        const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);     
        return res.render('Client_User/Home.ejs', { currnetClassID: ClassId, listClass: listClass, listExam: listCurrentExam })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

let getResult = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    // Lấy danh sách các lớp hiện có của user
    const listClass = await classService.getUserClasses(IDUser);
    let ClassId = req.params.classID;
    // Tìm class để lấy class hiện tại
    const currnetClass = await classService.getCurrentClass(ClassId);
    const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);
    const listResult = await resultService.filterResultOfUserByExam(listCurrentExam, IDUser);
    return res.render('Client_User/Result.ejs', { currnetClassID: ClassId, listClass: listClass, listResult: listResult})
}

let getMember = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassId = req.params.classID;
    const keyword = req.query.keyword; 
    try {
        // Chờ kết quả của IDOwnerClass
        let IDOwnerClass = await userService.getOwnerIDClass(ClassId);
        const OwerOrNotOwer = (IDOwnerClass==IDUser)?true:false;
        let listMember;
        if (keyword) {
            listMember = await userService.searchMembersByKeyword(ClassId, keyword);
        } else {
            // Lấy tất cả thành viên trong lớp
            const currnetClass = await classService.getCurrentClass(ClassId);
            listMember = await userService.getMemberInClass(currnetClass);
        }

        const listClass = await classService.getUserClasses(IDUser);

        // Render view với lớp hiện tại, danh sách lớp và thành viên
        return res.render('Client_User/Member.ejs', {
            currnetClassID: ClassId,
            listClass: listClass,
            listMember: listMember,
            IDOwnerClass: IDOwnerClass,
            OwerOrNotOwer:OwerOrNotOwer // Có thể thêm IDOwnerClass vào view nếu cần
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
};
let getInformation = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    try {
        const listClass = await classService.getUserClasses(IDUser);

        const userAccount = await userService.loadUserName(IDUser);
        return res.render('Client_User/information.ejs', {userAccount: userAccount, listClass: listClass})
    } catch (error) {
        console.log(error);
        
    }
}

let getChangePW = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    try {
        const listClass = await classService.getUserClasses(IDUser);
        const userAccount = await userService.loadUserName(IDUser);
        
        return res.render('Client_User/changepw.ejs', {userAccount: userAccount, listClass: listClass})
    } catch (error) {
        console.log(error);
        
    }
}


let createClass = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const { nameDisplay } = req.body;
    if (nameDisplay) {
        try {
            // Tạo lớp mới
            const newClass = await classService.createClass(nameDisplay,IDUser);
            // Thêm lớp mới vào người dùng
            // await userService.addClass(newClass._id, IDUser);
            return res.redirect(`/client/home/${newClass._id}`)
        } catch (error) {
            console.log(error);
            res.json({
                status: 'Error',
                data: error
            })
        }
    }
    else {
        console.log({
            status: 'err',
            message: "Name class must have, don't empty"
        });
    }

}

// Thao tac trang member

let addMember = async (req,res) =>{ 
    const classID = req.params.classID;
    let { idMember } = req.body;
    if(!mongoose.Types.ObjectId.isValid(idMember)){
        console.log('ID Member not valid');
        return res.redirect(`/client/member/${classID}`);
    }
    try {
        let checkUserExist = await userService.findUserbyID(idMember); 
        if(checkUserExist)
            await classService.addMember(classID, idMember);
        else
            console.log('This user does not register');
        return res.redirect(`/client/member/${classID}`);
    } catch (error) {
        console.log(error);
    }
}

let deleteMember = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const userIDDelete= req.query.userID;
    const classID = req.query.ClassID;
    const deleteMember = await classService.deleteMember(classID,userIDDelete);
    return res.redirect(`/client/member/${classID}`)
}

// Ket thuc thao tac trang member

let getAllClasses = async (req, res) => {
    try {
        const listClass = await classService.getAllClass();
        res.json({
            status: 'Ok',
            data: listClass
        })
    } catch (error) {
        console.log(error);

        res.json({
            status: 'Error',
        })
    }
}

let editAccount = async(req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const{userName, userDate} = req.body;
    try {
        const parts = userDate.split('/');
        const year = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10) - 1; // Giảm 1 vì tháng bắt đầu từ 0
        const day = parseInt(parts[0], 10);

        // Tạo đối tượng Date với giờ UTC
        const formattedDate = new Date(Date.UTC(year, month, day));
        const user = await userService.editAccount(IDUser, userName, formattedDate)

        return res.redirect('/client/information')

    } catch (error) {

    console.log(error);

    }
}

let editPassword = async(req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const{new_password} = req.body;
    try {
        const user = await userService.editPassword(IDUser,new_password);
        return res.redirect('/client/information')
    } catch (error) {
    console.log(error);
        
    }
}


let handleUpLoadFile =  async (req, res) => {

    try {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }

        // Hiển thị ảnh đã tải lên cho người dùng kiểm tra
        res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/client/information">Upload another image</a>`);
    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        res.send(err);
    }
}


module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass, getInformation, getChangePW, editAccount, editPassword, handleUpLoadFile,deleteMember,addMember
}
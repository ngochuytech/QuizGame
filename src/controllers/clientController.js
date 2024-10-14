import mongoose from 'mongoose'
import { User } from '../models/userModel'
import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'
import questionSerivce from '../services/questionService'
import jwt from '../middleware/jwtAction'
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import appRoot from 'app-root-path'

let getHome = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        const user = await userService.findUserbyID(IDUser);
        const listClass = await classService.getUserClasses(IDUser); 
        return res.render('Client_User/Home.ejs', { currnetClassID: '-1',user: user, currnetClass: "None", listClass: listClass, listExam: [] });
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
        const user = await userService.findUserbyID(IDUser);
        const currnetClass = await classService.getCurrentClass(ClassId);
        const listCurrentExam = await examService.filterExamByClass(currnetClass.Exams);     
        return res.render('Client_User/Home.ejs', { currnetClassID: ClassId, user: user, currnetClass: currnetClass, listClass: listClass, listExam: listCurrentExam })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

let getResult = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    let ClassId = req.params.classID;
    try {
        const user = await userService.findUserbyID(IDUser);
        // Lấy danh sách các lớp hiện có của user
        const listClass = await classService.getUserClasses(IDUser);
        // Tìm class để lấy class hiện tại
        const currnetClass = await classService.getCurrentClass(ClassId);
        const {resultOfUser, examOfUser} = await resultService.findResultsByUser(IDUser, currnetClass);
        return res.render('Client_User/Result.ejs', { currnetClassID: ClassId, currnetClass, user: user, listClass: listClass, resultOfUser, examOfUser})
    } catch (error) {
        console.log(error);
    }

}

let getMember = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const ClassId = req.params.classID;
    const keyword = req.query.keyword; 
    try {
        const user = await userService.findUserbyID(IDUser);
        // Chờ kết quả của IDOwnerClass
        let IDOwnerClass = await userService.getOwnerIDClass(ClassId);
        const OwerOrNotOwer = (IDOwnerClass==IDUser)?true:false;
        const currnetClass = await classService.getCurrentClass(ClassId);
        let listMember;
        if (keyword) {
            listMember = await userService.searchMembersByKeyword(ClassId, keyword);
        } else {
            // Lấy tất cả thành viên trong lớp
            listMember = await userService.getMemberInClass(currnetClass);
        }

        const listClass = await classService.getUserClasses(IDUser);

        // Render view với lớp hiện tại, danh sách lớp và thành viên
        return res.render('Client_User/Member.ejs', {
            currnetClassID: ClassId,
            currnetClass: currnetClass,
            listClass: listClass,
            listMember: listMember,
            IDOwnerClass: IDOwnerClass,
            OwerOrNotOwer:OwerOrNotOwer, // Có thể thêm IDOwnerClass vào view nếu cần
            user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Có lỗi xảy ra khi lấy dữ liệu.');
    }
};

let getWaitingRoom = async(req,res) =>{
    const ClassId = req.params.classID;
    const examId = req.params.examID;
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentExam = await examService.findExambyID(examId);
        // Số lượng câu hỏi dễ, trung bình, khó     
        const numberDiffculty = await questionSerivce.getNumberOfQuestionByDiffculty(currentExam);
        return res.render('Client_User/waitingRoom.ejs',
            {
                user: user,
                currentExam: currentExam,
                numberDiffculty: numberDiffculty,
                currnetClassID: ClassId
            }
        );
    } catch (error) {
        console.log(error);
        
    }

}

let getInformation = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    try {
        const user = await userService.findUserbyID(IDUser);
        const listClass = await classService.getUserClasses(IDUser);

        const userAccount = await userService.loadUserName(IDUser);
        return res.render('Client_User/information.ejs', {userAccount: userAccount, user: user, listClass: listClass})
    } catch (error) {
        console.log(error);
        
    }
}

let getChangePW = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    try {
        const user = await userService.findUserbyID(IDUser);
        const listClass = await classService.getUserClasses(IDUser);
        
        return res.render('Client_User/changepw.ejs', { user: user, listClass: listClass})
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


let handleUpLoadFile = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;

    const newFileName = IDUser + path.extname(req.file.originalname); // Tên file mới sẽ được lưu

    // Kiểm tra và xóa file cũ nếu có
    fs.readdir(path.join(appRoot.path, 'public/images'), (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send('Error reading directory');
        }

        // Kiểm tra xem có file nào của user không
        const userImageRegex = new RegExp(`^${IDUser}\\..+$`); // Regex để tìm file của user
        const filesToDelete = files.filter(file => userImageRegex.test(file) && file !== newFileName); // Lọc ra các file của user, nhưng bỏ qua file mới // Lọc ra các file của user
        
        // Xóa các file cũ
        filesToDelete.forEach(file => {
            fs.unlink(path.join(appRoot.path, 'public/images/', file), (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
        });

        return new Promise(async (resolve, reject)=>{
            try {
                const user = await User.findByIdAndUpdate(IDUser, {
                    avatar: "/images/" + newFileName
                })
                resolve(user);
                return res.redirect("/client/information")
            } catch (error) {
                reject({
                    message: 'Could not load the user password',
                    status: 'err'
                })
            }
        })
            

    });
};


module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass, getInformation, getChangePW, 
    editAccount, editPassword, handleUpLoadFile,deleteMember,addMember,getWaitingRoom
}
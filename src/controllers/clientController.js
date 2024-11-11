import mongoose from 'mongoose'
import { User } from '../models/userModel'
import classService from '../services/classService'
import examService from '../services/examService'
import resultService from '../services/resultService'
import userService from '../services/userService'
import noticeService from '../services/noticeService'
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
        const allClass= await classService.getAllClass(IDUser); 
        const notOwnerClass = allClass.filter(
            (classItem) => !listClass.some((userClass) => userClass._id.toString() === classItem._id.toString())
        );        
        return res.render('Client_User/HomeDefault.ejs', { currentClassID: '-1',user: user, currentClass: "None", listClass: listClass,notOwerClass:notOwnerClass});
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
        const currentClass = await classService.getCurrentClass(ClassId);
        const listCurrentExam = await examService.filterExamByClass(currentClass.Exams);
        const notice = await noticeService.getAllNoticeByClassID(ClassId);
        return res.render('Client_User/Home.ejs', { currentClassID: ClassId, user: user, page: 'baithi', currentClass: currentClass, listClass: listClass, listExam: listCurrentExam,notice:notice })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
let getNotice = async (req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    let ClassId = req.params.classID;
    try{
        const listClass = await classService.getUserClasses(IDUser);
        const {notice, userInNotice} = await noticeService.getAllNoticeAndUserInNoticeByClassID(ClassId);
        const user = await userService.findUserbyID(IDUser);
        const currentClass = await classService.getCurrentClass(ClassId);
        return res.render('Client_User/notice.ejs', {AllNotice:notice,userInNotice:userInNotice,currentClassID: ClassId,currentClass: currentClass,user:user,listClass: listClass, page: 'thongbao'})
    }
    catch(error)
    {
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
        const currentClass = await classService.getCurrentClass(ClassId);
        const notice = await noticeService.getAllNoticeByClassID(ClassId);
        const {resultOfUser, examOfUser} = await resultService.findResultsByUser(IDUser, currentClass);
        return res.render('Client_User/Result.ejs', { currentClassID: ClassId, page: 'ketqua', currentClass, user: user, listClass: listClass, resultOfUser, examOfUser,notice:notice})
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
        const notice = await noticeService.getAllNoticeByClassID(ClassId);
        // Chờ kết quả của IDOwnerClass
        let IDOwnerClass = await userService.getOwnerIDClass(ClassId);
        const OwerOrNotOwer = (IDOwnerClass==IDUser)?true:false;
        const currentClass = await classService.getCurrentClass(ClassId);
        let listMember;
        if (keyword) {
            listMember = await userService.searchMembersByKeyword(ClassId, keyword);
        } else {
            // Lấy tất cả thành viên trong lớp
            listMember = await userService.getMemberInClass(currentClass);
        }

        const listClass = await classService.getUserClasses(IDUser);

        // Render view với lớp hiện tại, danh sách lớp và thành viên
        return res.render('Client_User/Member.ejs', {
            currentClassID: ClassId,
            page: 'thanhvien',
            currentClass: currentClass,
            listClass: listClass,
            listMember: listMember,
            IDOwnerClass: IDOwnerClass,
            OwerOrNotOwer:OwerOrNotOwer, // Có thể thêm IDOwnerClass vào view nếu cần
            user: user,
            notice:notice
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
                currentClassID: ClassId
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

let leaveClass = async (req,res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const classID = req.params.classID;
    try {
        await classService.leaveClass(IDUser, classID);
        return res.redirect("/client/home");
    } catch (error) {
        console.log("Loi tai leaveClass" ,error);
    }
}

// Thao tac trang member

let addMember = async (req,res) =>{ 
    const classID = req.params.classID;
    let idMember  = req.body.idMember;
    console.log(idMember);
    if(!mongoose.Types.ObjectId.isValid(idMember)){
        console.log('ID Member not valid');
        return res.redirect(`/client/member/${classID}`);
    }
    try {
        // Kiểm tra người dùng có tài khoản không ?
        let checkUserExist = await userService.findUserbyID(idMember); 
        // Kiểm tra người dùng đã có trong lớp này chưa ?
        let checkUserInClass = await classService.findUserInClass(idMember, classID);
        if(checkUserExist)
            if(!checkUserInClass)
                await classService.addMember(classID, idMember);
            else
                console.log('Users already in this class');
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


let quizStart = async (req, res) =>{
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const classID = req.params.classID;
    const examID = req.params.examID;
    try {
        const user = await userService.findUserbyID(IDUser);
        const currentExam = await examService.findExambyID(examID);
        const listQuestion = await questionSerivce.filterQuestionByExam(currentExam);
        
        if(currentExam.state=='Open')
            await examService.updateState(currentExam._id, 'Examining');
        if(currentExam.creator?.idCreator.equals(IDUser))
            return res.redirect(`/host/leaderboard/${classID}/${examID}`);
        return res.render('Client_User/quizStart.ejs', {user, currentExam, listQuestion, classID});
    } catch (error) {
        console.log(error);
    }
}


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
        const parts = userDate.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Giảm 1 vì tháng bắt đầu từ 0
        const day = parseInt(parts[2], 10);

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
let createResultExam = async(req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const {examID, numberCorrect, score} = req.body;
    const classID = req.params.classID;
    try {
        const user = await userService.findUserbyID(IDUser);
        const exam = await examService.findExambyID(examID);
        const result = await resultService.saveResult(examID, IDUser, score,numberCorrect)
        return res.redirect(`/client/resultexam/${classID}/${examID}/${result._id}`);
    } catch (error) {
        console.log(error)
    }
}

let postResultExam = async(req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const {name, score, length,classID} = req.body;
    const resultID = req.params.resultID;
    try {
        const user = await userService.findUserbyID(IDUser);
       const result = await resultService.getResult(resultID);
       const exam  = await examService.findExambyID(result.examID);
        return res.render('Client_User/ResultExam.ejs', { user,exam,result,classID});
    } catch (error) {
        console.log(error)
    }
}
let getResultExam = async(req, res) => {
    const token = req.cookies.jwt;
    let IDUser = jwt.verifyToken(token)._id;
    const IDresult = req.params.resultID;
    const IDexam = req.params.examID;
    const classID = req.params.classID;

    try{
        const user = await userService.findUserbyID(IDUser);
        const result = await resultService.getResult(IDresult);
        const exam  = await examService.findExambyID(IDexam);
        return res.render('Client_User/ResultExam.ejs', { classID,user,result,exam});
       }
    catch(error)
    {
        console.log(error)
    }
}
let logout = async(req, res) => {
    try{
    res.clearCookie('jwt');
    return res.redirect('/client/login');
    } catch (error) {
    console.log(error);
    return res.status(500).send('Có lỗi xảy ra. Vui lòng thử lại sau.');
}
}
let joinClass = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        const classID = req.params.classID;

        const classInfo = await classService.getCurrentClass(classID);
        const ownerID = classInfo.ownerID;

        const notice = noticeService.InsertNotice(IDUser,ownerID,classID,'Yêu cầu tham gia vào lớp '+classInfo.nameDisplay);
        res.status(200).send({ message: 'Request to join class sent successfully.' });
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).send({ message: 'Failed to join class.' });
    }
};
let deleteNotice =  async (req, res) => {
    try {
        const token = req.cookies.jwt;
        let IDUser = jwt.verifyToken(token)._id;
        const classID = req.params.classID;

        const IDuser = req.query.IDuser;

        const deleteUser = noticeService.deleteNoticeByIDSend(IDuser,classID);

        res.status(200).send({ message: 'Request to join class sent successfully.' });
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).send({ message: 'Failed to join class.' });
    }
}
module.exports = {
    getHome, getResult, getMember, createClass, getAllClasses, getHomeClass,joinClass, getInformation, getChangePW, 
    editAccount, editPassword, handleUpLoadFile,deleteMember,addMember,getWaitingRoom, leaveClass,
    quizStart, postResultExam,getResultExam,logout,createResultExam,getNotice,deleteNotice,deleteNotice
}
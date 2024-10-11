import mongoose from "mongoose";
import { User } from '../models/userModel';
import { Class } from '../models/classModel';

const createUserService = ({ accountName, password}) =>{
    return new Promise(async (resolve, reject) => {
        try {
            
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(accountName)
            if(isEmail){
                const checkEmail = await User.find({accountName: accountName})
                if(checkEmail.length){
                    reject({
                        status: 'err',
                        message: "Duplicate email"
                    })
                }
                const newUser = await User.create({
                    _id: new mongoose.Types.ObjectId(),
                    nameDisplay: accountName,
                    accountName: accountName,
                    password
                })
                resolve(newUser);
            }
            else{
                reject({
                    status: 'err',
                    message: 'Account name is not a email'
                })
            }
        } catch (error) {
            reject({
                status: 'err',
                data: error
                
            })
        }
    });
}

let loginUserService = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({accountName: email, password: password});
            if(checkUser!=null){
                resolve(checkUser._id)
            }
            resolve(null)
        } catch (error) {
            reject({
                message: error,
                status: 'err'
            })
        }
    })
}
const getMemberInClass = (Class) => {
    return new Promise(async (resolve, reject) => {
        try {
            const members = [];
            // Chủ phòng
            const owner = await User.findOne({_id: Class.ownerID});
            members.push(owner);
            // Thành viên
            for(let i=0; i<Class.members.length; i++){
                const item = await User.findById(Class.members[i]._id);
                members.push(item);
            }      
            resolve(members)

        } catch (error) {
            reject(error)
        }
    })
}
const searchMembersByKeyword = async (classId, keyword) => {
    try {
        const regex = new RegExp(keyword, 'i'); // Tìm kiếm không phân biệt hoa thường

        // Tìm kiếm lớp dựa vào classId và populate owner và members
        const classData = await Class.findById(classId)
            .populate('ownerID')
            .populate('members')
            .exec();

        if (!classData) {
            throw new Error('Class not found');
        }

        const matchingMembers = [];

        // Kiểm tra xem từ khóa có khớp với chủ phòng (ownerID) không
        if (classData.ownerID && (regex.test(classData.ownerID.nameDisplay))) {
            matchingMembers.push(classData.ownerID);
        }

        // Kiểm tra các thành viên (members)
        classData.members.forEach(member => {
            if (regex.test(member.nameDisplay)) {
                matchingMembers.push(member);
            }
        });

        return matchingMembers;
    } catch (error) {
        console.error(error);
        throw new Error('Error searching members by keyword');
    }
};
const loadUserName = (IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.find({_id: IDUser });
            if(!user){
                return reject(new Error('The user is not exist.'));   
            }
            resolve(user);

        } catch (error) {
            reject({
                message: 'Could not load the user information',
                status: 'err'
            })
        }

    })
}

const editAccount = (IDUser, userName, userDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate( IDUser, {
                nameDisplay: userName,
                date: userDate
             } )
            resolve(user);

        } catch (error) {
            reject({
                message: 'Could not load the user information',
                status: 'err'
            })
        }
    })
}
const editPassword = (IDUser, Password) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const user = await User.findByIdAndUpdate(IDUser, {
                password: Password
            })

            
            resolve(user);
        } catch (error) {
            reject({
                message: 'Could not load the user password',
                status: 'err'
            })
        }
    })
}

let getIDbyEmailAndPassWord = ({ accountName, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ accountName: accountName, password: password });
            if(user)
                resolve(user._id);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Cập nhật thông tin lớp của user khi được tạo 1 lớp mới
let addClass = (idClass, idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate(idUser,  {$push: { MyClassId: idClass }});
            if(user)
                resolve(user);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Cập nhật thông tin lớp của user khi được xoá 1 lớp 
let deleteClass = (idClass, idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndUpdate(idUser,  {$pull: { MyClassId: idClass }});
            if(user)
                resolve(user);
            }
        catch (error) {
            reject(error)
        }
    })   
}

// Tìm User bằng ID
let findUserbyID = (IDUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: IDUser }); 
            resolve(user);
        }
        catch (error) {
            reject(error)
        }
    })   
}
let getOwnerIDClass = (IDClass) => {
    return new Promise(async (resolve, reject) => {
        try {
            const MyClass = await Class.findOne({ _id: IDClass }); // Sử dụng findOne để lấy ra 1 đối tượng
            if (MyClass) {
                resolve(MyClass.ownerID); // Trả về ownerID của class
            } else {
                reject(new Error('Class not found'));
            }
        } catch (error) {
            reject(error); // Xử lý lỗi nếu có
        }
    });
};

module.exports = {
    createUserService, loginUserService,getMemberInClass, getIDbyEmailAndPassWord, findUserbyID, addClass,
    deleteClass, loadUserName, editAccount, editPassword,searchMembersByKeyword,getOwnerIDClass
}
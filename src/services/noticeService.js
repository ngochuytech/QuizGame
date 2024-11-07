import { Notice } from '../models/noticeModel'
import { Class } from '../models/classModel'
import { User } from '../models/userModel'

const InsertNotice = (IDsend,IDreceived,IDClass,content) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notice = await Notice.create({
                IDsend: IDsend,
                IDreceived: IDreceived,
                IDClass: IDClass,
                content: content 
            });
            resolve(notice)
        } catch (error) {
            reject(error)
        }
    })
}
const getAllNoticeAndUserInNoticeByClassID = (classID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const notice = await Notice.find({ IDClass: classID });

            const senderIds = notice.map(n => n.IDsend);

            const userInNotice = await Promise.all(
                senderIds.map(async id => await User.findById(id))
            );

            resolve({ notice, userInNotice });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thông báo và người dùng:", error);
            reject(error);
        }
    });
};
const deleteNoticeByIDSend = (IDUser,classID) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const notice = await Notice.deleteOne({ IDsend: IDUser ,IDClass:classID});
            resolve({ notice});
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thông báo và người dùng:", error);
            reject(error);
        }
    });
};
const getAllNoticeByClassID = (classID) =>{
    return new Promise(async (resolve, reject) => {
        try {
            const notice = await Notice.find({ IDClass: classID });
            resolve(notice);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thông báo và người dùng:", error);
            reject(error);
        }
    });
};

module.exports = {
    InsertNotice,getAllNoticeAndUserInNoticeByClassID,deleteNoticeByIDSend,getAllNoticeByClassID
}
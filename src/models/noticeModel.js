import mongoose from "mongoose";
const Schema = mongoose.Schema;
const noticeSchema = new Schema({
    IDsend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    IDreceived: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    IDClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    content: {
        type: String
    },
    time: {
        type:Date,
        default:Date.now()
    }
})

export const Notice = mongoose.model('Notice', noticeSchema)
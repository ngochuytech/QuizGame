import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const resultSchema = new Schema({
    _id: ObjectId,
    examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    },
    particantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    grade: {
        type: Number,
        default: 0
    }
})

export const result = mongoose.model('Result', resultSchema)
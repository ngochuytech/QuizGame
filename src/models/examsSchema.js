import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const examsSchema = new Schema({
    _id: ObjectId,
    nameDisplay:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    },
    particantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})

export const Exams = mongoose.model('Exams', examsSchema);
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const examsSchema = new Schema({
    nameDisplay:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    }],
    particantsID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    results: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result'
    }],
    createAt: {
        type: Date,
        default: Date.now()
    }
})

export const Exam = mongoose.model('Exam', examsSchema);
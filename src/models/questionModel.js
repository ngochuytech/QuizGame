import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const answerSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
})

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: [answerSchema],
        required: true
    }
})
export const Questions = mongoose.model('Questions', questionSchema);

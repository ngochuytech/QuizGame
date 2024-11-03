import mongoose from "mongoose";
const Schema = mongoose.Schema;

const creatorSchema = new Schema({
    idCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    nameCreator: {
        type: String
    }
})

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
    creator: {
        type: creatorSchema
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    state:{
        type:String,
        default: 'Open'
    },
    time:{
        hard: {
            type: Number,  
            default: 10
        },
        medium: {
            type: Number,
            default: 8
        },
        easy:
        {
            type:Number,
            default:5
        }
    }
})

export const Exam = mongoose.model('Exam', examsSchema);
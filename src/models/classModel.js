import mongoose from "mongoose";
const Schema = mongoose.Schema;
const classSchema = new Schema({
    nameDisplay: {
        type: String
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    }],
    Exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exams'
    }]

})

export const Class = mongoose.model('Class', classSchema)
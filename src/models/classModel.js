import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const classSchema = new Schema({
    nameDisplay: {
        type: String
    },
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
    }
    
})

export const Class = mongoose.model('Class', classSchema)
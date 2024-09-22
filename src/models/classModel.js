import mongoose from "mongoose";
const Schema = mongoose.Schema;

const classSchema = new Schema({
    nameDisplay: {
        type: String
    }
    
})

export const Class = mongoose.model('Class', classSchema)
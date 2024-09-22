import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    nameDisplay: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', UserSchema);

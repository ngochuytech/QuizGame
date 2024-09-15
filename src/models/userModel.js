import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export const User = mongoose.model('User', UserSchema);

import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
    },
    email: {
        type: String,
        unique: true
    },
    date: {
        type: Date
    },
    avatar: {
        type: String,
        default: './public/images/avatar.png'
    }
})

export const User = mongoose.model('User', UserSchema);

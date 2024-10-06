import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    _id: ObjectId,
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
    date: {
        type: Date,
        default: Date.now()
    },
    avatar: {
        type: String,
        default: './public/images/avatar.png'
    },
    MyClassId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
})

export const User = mongoose.model('User', UserSchema);

// const Class = require('../models/classModel');
// const { Question } = require('../models/questionModel.js');
// const Exam = require('../models/examsSchema');
// const User = require('../models/userModel');
import {Questions} from '../models/questionModel.js';
import { Class } from "../models/classModel";
import {User} from '../models/userModel.js'
let getHome = (req, res) => {
    return res.render('Client_User/Home.ejs')
}

let getResult = (req, res) => {
    return res.render('Client_User/Result.ejs')
}

let getMember = (req, res) => {
    return res.render('Client_User/Member.ejs')
}

let createClass = async (req, res) => {

    // Tạo các câu hỏi cho lớp học
    try {
        // Tạo lớp học và thêm các câu hỏi vào bộ câu hỏi của lớp
        const class1 = new Class({
            nameDisplay: "Geography Class",
            description: "This is a geography class.",
        });

        await class1.save();
        console.log('Class and questions created successfully');
        return res.json({
            class1
        })
        
    } catch (error) {
        console.log(error);

    }

}

module.exports = {
    getHome, getResult, getMember, createClass
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Result = new Schema({


    classname: {
        type: String,
        required: true,
    },
    subjectname : {
        type : String,
        required : true,
       
    },
    chaptername : {
        type : String,
        required : true,
        
    },
    topicname : {
        type : String,
        required : true,
    },
    userId : {
        type : String
    },
    percentage : {
        type : String
    },
    totalQuestionLength : {
        type : String
    },
    score : {
        type : String
    },
    incorrectanswers : {
        type : Object
    },
   
})

const newResult = mongoose.model('Result', Result);
module.exports = newResult;

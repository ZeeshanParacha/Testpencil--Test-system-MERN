const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saveSession = new Schema({


    totalQuestionAttempt: {
        type: String,
    },
    totalQuestionLength : {
        type : String,
    },
    userId : {
        type : String,  
    },
    classname : {
        type : String,
    },
    subjectname : {
        type : String,
    },
    chaptername : {
        type : String,
        
    },
    topicname : {
        type : String,
       
    },

})



const newsaveSession = mongoose.model('Session', saveSession);

module.exports = newsaveSession;
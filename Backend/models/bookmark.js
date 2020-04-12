const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookMark = new Schema({


    classname: {
        type: String,
        
       
    },
    Subject : {
        type : String,
       
       
    },
    Chapter : {
        type : String,
       
        
    },
    Topic : {
        type : String,
       
       
    },
    
    Question : {
        type : String,
    },
    Option1 : {
        type : String,
        
    },
    Option2 : {
        type : String,
       
    },
    Option3 : {
        type : String,
        
    },
    CorrectAnswer : {
        type : String,
        
    },
    videopath : {
        type : String,
        
    },
    Questionimagepath : {
        type : String,
        
    },
    audioPath : {
        type : String,
        
    },
    questionId : {
        unique : true,
        type : String,
        
    },
    userid : {
        type : String
    }
  
})



const newBookmark = mongoose.model('Bookmark', bookMark);

module.exports = newBookmark;
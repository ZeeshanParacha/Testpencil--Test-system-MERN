const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Classes = new Schema({


    classname: {
        type: String,
        required: true,
       
    },
    Subject : {
        type : String,
        required : true,
       
    },
    Chapter : {
        type : String,
        required : true,
        
    },
    Topic : {
        type : String,
        required : true,
       
    },
    SubjectimgPath : {
        type : String
    },
    ChapterimgPath : {
        type : String
    },
    TopicimgPath : {
        type : String
    },
    content: {
        type : Array
    }
    // subjects: {
    //     type: Object,

    // },
    // chapters: {
    //     type: Object,

    //       },
    //  topics : {
    //      type : Object,
    //  }




    // friendIds : Array
})
Classes.index({"$**":"text"})


const Createclass = mongoose.model('AllClasses', Classes);

module.exports = Createclass;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Auth = new Schema({


    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    gender : {
        type: String,
        required: true,
    },
    phone : {
        type : String
    },

    resetPasswordToken:{
        type : String
    } ,
    resetPasswordExpires: {
        type : Date
    },


    // friendIds : Array
})


const UserAuth = mongoose.model('userAuth', Auth);

module.exports = UserAuth;
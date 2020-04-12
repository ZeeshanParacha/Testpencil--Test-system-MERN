const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminAuth = new Schema({


    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken:{
        type : String
    } ,
    resetPasswordExpires: {
        type : Date
    },

})


const adminAuth = mongoose.model('admin', AdminAuth);

module.exports = adminAuth;
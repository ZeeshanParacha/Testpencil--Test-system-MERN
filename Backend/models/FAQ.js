const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FAQ = new Schema({


    Question: {
        type: String,
        required: true,
        

    },
     Answer: {
        type: String,
        required: true,
    },


    // friendIds : Array
})


const HelpFAQ = mongoose.model('FAQ', FAQ);

module.exports = HelpFAQ;
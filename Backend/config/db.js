
const mongoose = require("mongoose");

// connection URI
const mongoURI = "mongodb+srv://saurabh:saurabh123@cluster0-zzutt.mongodb.net/test?retryWrites=true&w=majority"

// remove deprecation warning of collection.ensureIndex
mongoose.set('useCreateIndex', true);

// connect to mongodb
mongoose.connect(mongoURI , { useUnifiedTopology: true,useNewUrlParser: true, useFindAndModify: false ,useCreateIndex: true,})

module.exports = mongoose;
const express = require('express');
const db = require('./config/db');
const app = express();

var cors = require('cors');



// test db connection
db.connection.once('open', () => console.log("connected to db")).on("error", (err) => console.log("error connecting db -->", err))

app.listen(process.env.PORT || 8080, function() {
    console.log('listening on 3000')
})

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.use('/',require('./routes/index.js')) // redirect to index.js
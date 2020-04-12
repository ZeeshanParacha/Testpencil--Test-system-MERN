const express = require('express');
const router = express.Router();
const Result = require('../models/result');


//FAQ
router.post('/StoreResult', (req, res) => {

    console.log('req.body', req.body)
    let Resultdata = req.body

    Result.updateOne({
        classname: req.body.classname, subjectname: req.body.subjectname,
        chaptername: req.body.chaptername, topicname: req.body.topicname
    },{ $set : {
        percentage :  Resultdata.percentage,
        totalQuestionLength :  Resultdata.totalQuestionLength,
        userId :  Resultdata.userId,
        classname :  Resultdata.classname,
        subjectname :  Resultdata.subjectname,
        chaptername :  Resultdata.chaptername,
        topicname :  Resultdata.topicname,
        incorrectanswers : Resultdata.incorrectanswers,
        score : Resultdata.score
     } },{upsert : true}
    ).then((result) => {
        console.log('res--->' , result)
        if(result.nModified == '1' || result.n == '1' ){
            res.send({ message: 'Resultdata Saved', isSuccess: true })
        }
        else {
            console.log('Resultdata?--->' , res)
            res.send({ message: 'Resultdata not Saved', isSuccess: false })
        }
    }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message, isSuccess: false })
    })
})

router.post('/fetchResults', (req, res) => {
    Result.find({ userId : req.body.userId})
        .then((result) => {
            if (result) {
                console.log('fetchResults--->' , result)
                res.send({ isSuccess: true, result })
            } else {
                console.log('fetchResults--->' , result)
                res.send({ isSuccess: false })
            }
        }).catch(e => {
            console.log('e====>', e)
            res.send({ message: e.message })
        })
})

router.get('/fetchAllResults', (req, res) => {
    Result.find()
        .then((result) => {
            if (result) {
                console.log('fetchResults--->' , result)
                res.send({ isSuccess: true, result })
            } else {
                console.log('fetchResults--->' , result)
                res.send({ isSuccess: false })
            }
        }).catch(e => {
            console.log('e====>', e)
            res.send({ message: e.message })
        })
})



  

module.exports = router;
const express = require('express');
const router = express.Router();
const SaveSession = require('../models/session');



//FAQ
router.post('/Savesession', (req, res) => {

    console.log('req.body', req.body)
    let sessiondata = req.body

    SaveSession.updateOne({
        classname: req.body.classname, subjectname: req.body.subjectname,
        chaptername: req.body.chaptername, topicname: req.body.topicname
    },{ $set : {
        totalQuestionAttempt :  sessiondata.totalQuestionAttempt,
        totalQuestionLength :  sessiondata.totalQuestionLength,
        userId :  sessiondata.userId,
        classname :  sessiondata.classname,
        subjectname :  sessiondata.subjectname,
        chaptername :  sessiondata.chaptername,
        topicname :  sessiondata.topicname,
     } } , {upsert : true}
    ).then((result) => {
        console.log('res--->' , result)
        if(result.nModified == '1' || result.n == '1' ){
            res.send({ message: 'Session Saved', isSuccess: true })
        }
        else {
            console.log('sessionsaved?--->' , res)
            res.send({ message: 'Session not Saved', isSuccess: false })
        }
        
    }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message, isSuccess: false })
    })
})

router.post('/fetchSavesession', (req, res) => {
    SaveSession.find({ userId : req.body.userId})
        .then((result) => {
            if (result) {
                console.log('fetchSavesession--->' , result)
                res.send({ isSuccess: true, result })

            } else {
                console.log('fetchSavesession--->' , result)
                res.send({ isSuccess: false })
            }
        }).catch(e => {
            console.log('e====>', e)
            res.send({ message: e.message })
        })
})


module.exports = router;
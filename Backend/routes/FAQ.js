const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');
const multer = require('multer');
const mongo = require('mongodb')
var ObjectId = require('mongodb').ObjectID;


//FAQ
router.post('/FAQ', (req, res) => {
 
  const newFAQ = req.body

  const newHelpQA = new FAQ(newFAQ)
  newHelpQA.save().then(() => {
    res.send({ message: 'FAQ ADDED', isSuccess: true })
  }).catch(e => {
    console.log('e====>', e)
    res.send({ message: e.message, isSuccess: false })
  })
})

router.get('/fetchFAQ', (req, res) => {
    FAQ.find()
      .then((result) => {
        if (result.length == 0) {
          res.send({ isSuccess: false })
        } else {
          res.send({ isSuccess: true, result })
        }
      }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message })
      })
  })
  

  //Delete Questions
router.post('/deleteFAQ', (req, res) => {
    console.log('documentId', req.body.documentId)
    FAQ.remove({ _id: req.body.documentId })
      .then((result) => {
        if (result.length == 0) {
          console.log('Resultdelete--->', result)
          res.send({ isSuccess: false })
        } else {
          console.log('Resultdelete--->', result)
          res.send({  isSuccess: true, result })
        }
      }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message })
      })
  })

  router.post('/modifyFAQ', (req, res) => {
    console.log('documentId', req.body.questionId)
    FAQ.updateOne({ _id: req.body.questionId },{
        $set : {Question : req.body.Question , Answer : req.body.Answer}
    })
      .then((result) => {
        if (result.length == 0) {
          console.log('Resultdelete--->', result)
          res.send({ isSuccess: false })
        } else {
          console.log('Resultdelete--->', result)
          res.send({  isSuccess: true, result })
        }
      }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message })
      })
  })

module.exports = router;
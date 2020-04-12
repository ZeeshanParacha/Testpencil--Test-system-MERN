const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');



//FAQ
router.post('/Bookmark', (req, res) => {
 
  console.log('req.body' , req.body)

  const newBookmark = new Bookmark(req.body.IndividialQuestion)
  newBookmark.save().then(() => {
    res.send({ message: 'Bookmark ADDED', isSuccess: true })
  }).catch(e => {
    console.log('e====>', e)
    res.send({ message: e.message, isSuccess: false })
  })
})

// router.post('/fetchBookmark', (req, res) => {
//   let bookmarkdata = req.body

//   console.log('bookmarkdata',bookmarkdata)

//   Bookmark.find({
//     classname : bookmarkdata.classname ,
//     Subject : bookmarkdata.subjectname ,
//     Topic : bookmarkdata.topicname ,
//     Chapter : bookmarkdata.chaptername , })
//       .then((result) => {
//          console.log('result--->' , result)
//         if (result.length == 0) {
//           res.send({ isSuccess: false })
//         } else {
//           res.send({ isSuccess: true, result })
//         }
//       }).catch(e => {
//         console.log('e====>', e)
//         res.send({ message: e.message })
//       })
//   })

  router.post('/search', (req, res) => {

    console.log('search--->', req.body.search)
    Bookmark.find({
      "$or": [
        {
          Subject: new RegExp(req.body.search, 'i'),
  
        },
        {
          Topic: new RegExp(req.body.search, 'i'),
  
        },
        {
          Chapter: new RegExp(req.body.search, 'i'),
  
        },
        
      ]
    })
      .then((result) => {
        if (result.length == 0) {
          res.send({ message: 'Class Not found', isSuccess: false })
        } else {
          console.log('Result--->', result)
          res.send({ message: 'Class Found', isSuccess: true, result })
        }
      }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message })
      })
  })
  
  

  router.post('/fetchBookmark', (req, res) => {
    let bookmarkdata = req.body
  
    console.log('bookmarkdata----->',bookmarkdata)
  
    Bookmark.find({userid : bookmarkdata.userid})
        .then((result) => {
           console.log('result--->' , result)
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

    
  router.post('/deleteAllfetchBookmark', (req, res) => {
    let bookmarkdata = req.body
  
    console.log('bookmarkdata----->',bookmarkdata)
  
    Bookmark.remove({userid : bookmarkdata.userid})
        .then((result) => {
           console.log('result--->' , result)
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


    router.post('/deleteQuestion', (req, res) => {
      Bookmark.remove({questionId : req.body.documentId})
        .then((result) => {
          if (result.length == 0) {
            res.send({ message: 'Item not deleted', isSuccess: false })
          } else {
            console.log('Result--->', result)
            res.send({ message: 'Item deleted', isSuccess: true, result })
          }
        }).catch(e => {
          console.log('e====>', e)
          res.send({ message: e.message })
        })
    })



module.exports = router;
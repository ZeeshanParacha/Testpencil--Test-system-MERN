const express = require('express');
const router = express.Router();
const createClass = require('../models/classes');
const multer = require('multer');
const mongo = require('mongodb')
var ObjectId = require('mongodb').ObjectID;


//Storing files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'audio/mp3' || file.mimetype === 'image/png' || file.mimetype === 'image/PNG') {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



//Create Class API
router.route("/Createclass")
  .post(upload.any(), (req, res) => {


    let Subjectimagepath;
    let Chapterimagepath;
    let Topicimagepath;

    for (let key in req.files) {

      console.log('---->', req.files[key])
      if (req.files[key].fieldname === 'Subjectimage') {
        Subjectimagepath = req.files[key].path;
      }
      else if (req.files[key].fieldname === 'Chapterimage') {
        Chapterimagepath = req.files[key].path;
      } else if (req.files[key].fieldname === 'Topicimage') {
        Topicimagepath = req.files[key].path;
      }
    }

    let createClassContent = JSON.parse(req.body.content);
    // myContentObj.imageName = imageName;

    createClassContent.SubjectimgPath = Subjectimagepath;
    createClassContent.ChapterimgPath = Chapterimagepath;
    createClassContent.TopicimgPath = Topicimagepath;

    const newClass = new createClass(createClassContent)
    createClass.findOne({ classname: createClassContent.classname, Subject: createClassContent.Subject, Topic: createClassContent.Topic, Chapter: createClassContent.Chapter })
      .then((result) => {
        if (result == null) {
          newClass.save().then(() => {
            res.send({ message: 'Class Created Successfully', isSuccess: true })
          }).catch(e => {
            console.log('e--->', e)
            res.send({ message: e.message, isSuccess: false })
          })
        } else {
          res.send({ message: 'Class Already Created', isSuccess: false })

        }
      })
  })

//Fetch All Classes API
router.get('/allclasses', (req, res) => {
  createClass.find()
    .then((result) => {
      if (result.length == 0) {
        res.send({ message: 'Users Not found', isClass: false })
      } else {
        res.send({ message: 'Users Found', isClass: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})

//Add Class Content
// router.post('/Addclasscontent', (req, res) => {
//   let newContent = req.body;
//   createClass.findOne({ _id: newContent.classid }).then((content) => {
//     console.log('content--->', content)
//     if (content != null) {
//       createClass.findOneAndUpdate({ _id: newContent.classid },
//         {
//           $push: {
//             content: newContent.content,
//           }
//         }).then((result) => {
//           if (result.length == 0) {
//             res.send({ message: 'No content Added', isSuccess: false })
//           } else {
//             console.log('content Added')
//             res.send({ message: 'content Added', isSuccess: true, result })
//           }
//         });
//     }
//   })
//   console.log('newContent---->', newContent)


// })


//Image Upload




//Add Class Content
router.route("/addquestions")
  .post(upload.any(), (req, res, next) => {

    // upload.any()
    console.log("req.file");
    console.log(req.files); //form files

    console.log("req.body");
    console.log(req.body); //form files

    let Questionimagepath;
    let audioPath;
    let documentId = new mongo.ObjectID()


    for (let key in req.files) {

      console.log('---->', req.files[key])
      if (req.files[key].fieldname === 'Questionimage') {
        Questionimagepath = req.files[key].path;
      } if (req.files[key].fieldname === 'Audio') {
        audioPath = req.files[key].path;
      }

    }



    let myContentObj = JSON.parse(req.body.content);
    // myContentObj.imageName = imageName;
    myContentObj.Questionimagepath = Questionimagepath;
    myContentObj.audioPath = audioPath;
    myContentObj.questionId = documentId;

    console.log('myContentObj--->', myContentObj)
    console.log('documentId', documentId)
    createClass.findOneAndUpdate({ classname: myContentObj.classname, Subject: myContentObj.Subject, Chapter: myContentObj.Chapter, Topic: myContentObj.Topic }, {
      $push: {
        content: myContentObj,
      }
    })
      .then((content) => {
        console.log('content--->', content)
        if (content.length == 0) {
          res.send({ message: 'No content Added', isSuccess: false })
        } else {
          console.log('content Added')
          res.send({ message: 'content Added', isSuccess: true, content })
        }
      })
  });


//Fetch Specific Class Q/A's API
router.post('/singleclasscontent', (req, res) => {

  console.log('req--->', req.body.classId)
  createClass.find({ classname: req.body.classId })
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

//Delete Questions
router.post('/deleteQuestion', (req, res) => {
  console.log('documentId', req.body.documentId)
  createClass.updateOne({ classname: req.body.classname , Subject : req.body.Subject , Chapter : req.body.Chapter , Topic : req.body.Topic },
    { "$pull": { 'content': { questionId: ObjectId(req.body.documentId) } } })
    .then((result) => {
      if (result.length == 0) {
        res.send({ message: 'Class Not found', isSuccess: false })
      } else {
        console.log('Resultdelete--->', result)
        res.send({ message: 'Class Found', isSuccess: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})

//modifyQuestion Class Content
router.route("/modifyQuestion")
  .post(upload.any(), (req, res, next) => {

    // upload.any()
    console.log("req.file");
    console.log(req.files); //form files

    console.log("req.body");
    console.log(req.body); //form files

    let Questionimagepath;
    let audioPath;

    for (let key in req.files) {

      console.log('---->', req.files[key])
      if (req.files[key].fieldname === 'Questionimage') {
        Questionimagepath = req.files[key].path;
      } if (req.files[key].fieldname === 'Audio') {
        audioPath = req.files[key].path;
      }

    }
    let myContentObj = JSON.parse(req.body.content);
    // myContentObj.imageName = imageName;
    myContentObj.Questionimagepath = Questionimagepath;
    myContentObj.audioPath = audioPath;
    myContentObj.questionId = ObjectId(myContentObj.questionId)
    console.log('myContentObj--->', myContentObj)
    // createClass.updateOne({_id : req.body.uniqueId},{
    //   $push: {
    //     content: myContentObj,
    //   }
    // })
    console.log(myContentObj.questionId, 'myContentObj.questionId')
    console.log(myContentObj.modifyquestionid, 'req.body.modifyquestionid')

    createClass.updateOne({  classname: myContentObj.classname, Subject: myContentObj.Subject, Chapter: myContentObj.Chapter, Topic: myContentObj.Topic},
      { "$pull": { 'content': { questionId: ObjectId(myContentObj.questionId) } } })
      .then(() => {
        createClass.updateOne({   classname: myContentObj.classname, Subject: myContentObj.Subject, Chapter: myContentObj.Chapter, Topic: myContentObj.Topic }, {
          $push: {
            content: myContentObj,
          }
        }).then((result) => {
          if (result.length == 0) {
            res.send({ message: 'Not modify', isSuccess: false })
          } else {
            console.log('Resultdelete--->', result)
            res.send({ message: 'Modified Questions', isSuccess: true, result })
          }
        })
      }).catch(e => {
        console.log('e====>', e)
        res.send({ message: e.message })
      })
  });

// find({ $or: [ 
//     { 
//       $text: {
//         $search: req.body.search
//       }
//     },
//     {
//       'Subject': {
//         $regex: req.body.search,
//         $options: 'i'
//     }
//   }
//   ] 
// })

router.post('/search', (req, res) => {

  console.log('search--->', req.body.search)
  createClass.find({
    "$or": [
      {
        Subject: new RegExp(req.body.search, 'i'),

      },
      {
        classname: new RegExp(req.body.search, 'i'),

      },
      {
        Topic: new RegExp(req.body.search, 'i'),

      },
      {
        Chapter: new RegExp(req.body.search, 'i'),

      }
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

router.post('/deleteclassMaterial', (req, res) => {
  console.log('documentId', req.body.classId)
  console.log('classmaterial', req.body.classmaterial)
  let materialName = req.body.materialName
  console.log('materialName', req.body.materialName)

  createClass.remove({ classname: req.body.classId, [materialName]: req.body.classmaterial })
    .then((result) => {
      if (result.length == 0) {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: false })
      } else {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})

router.route('/modifyclassContent').post(upload.any(), (req, res) => {

  let imageURL
  for (let key in req.files) {
    console.log('req.files[key]---->', req.files[key])
    if (req.files[key].fieldname === 'classContentImg') {
      imageURL = req.files[key].path;
    }

  }

  let createClassContent = JSON.parse(req.body.content);
  console.log('createClassContent----->', createClassContent)

  let classname = createClassContent.classname
  let modifycontentname = createClassContent.ModifyMaterialname
  let modifycontentvalue = createClassContent.ModifyMaterialvalue
  let modifymaterialimgpathname = createClassContent.ModifyMaterialimagePath
  let PreviousModifyMaterialvalue = createClassContent.PreviousModifyMaterialvalue

  createClass.updateOne({ classname: classname, [modifycontentname]: PreviousModifyMaterialvalue }, {
    $set: { [modifycontentname]: modifycontentvalue, [modifymaterialimgpathname]: imageURL }
  })
    .then((result) => {
      if (result.length == 0) {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: false })
      } else {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})

//Add content from All Classes screen 

router.route('/Addsubject').post(upload.any(), (req, res) => {

  let imageURL
  for (let key in req.files) {
    console.log('req.files[key]---->', req.files[key])
    if (req.files[key].fieldname === 'Newclasscontentimages') {
      imageURL = req.files[key].path;
    }
  }

  let createClassContent = JSON.parse(req.body.content);
  console.log('createClassContent----->', createClassContent)

  let classname = createClassContent.classname
  let Newcontentname = createClassContent.NewContentname
  let NewContentvalue = createClassContent.NewContentvalue

  let Newimgpathname = [Newcontentname] + 'imgPath';


  createClass.updateOne({ classname: classname, [Newcontentname]: NewContentvalue }, {
    $set: {
      [Newcontentname]: NewContentvalue,
      [Newimgpathname]: imageURL,
      Chapter: '',
      ChapterimgPath: '',
      Topic: '',
      TopicimgPath: '',
      classname: classname,
      content: []
    }
  }, { upsert: true })
    .then((result) => {
      if (result.length == 0) {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: false })
      } else {
        console.log('Resultdelete--->', result)
        res.send({ isSuccess: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})

router.route('/Addadditionalchapters').post(upload.any(), (req, res) => {

  let imageURL
  for (let key in req.files) {
    console.log('req.files[key]---->', req.files[key])
    if (req.files[key].fieldname === 'Newclasscontentimages') {
      imageURL = req.files[key].path;
    }
  }

  let createClassContent = JSON.parse(req.body.content);
  console.log('createClassContent----->', createClassContent)

  let classname = createClassContent.classname
  let Newcontentname = createClassContent.NewContentname
  let NewContentvalue = createClassContent.NewContentvalue
  let Subjectname = createClassContent.Subjectname


  let Newimgpathname = [Newcontentname] + 'imgPath';

  createClass.findOne({ classname: classname, Subject: Subjectname, Chapter: '', Topic: '' }).then((result) => {


    if (result) {
      console.log('Chal gaya------------------>')

      createClass.updateOne({ classname: classname, Subject: Subjectname, Chapter: '', }, {
        $set: {
          classname: classname,
          [Newcontentname]: NewContentvalue,
          [Newimgpathname]: imageURL,
          Subject: Subjectname,
          SubjectimgPath: result.SubjectimgPath
        }
      })
        .then((result) => {
          if (result.length == 0) {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: false })
          } else {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: true, result })
          }
        }).catch(e => {
          // console.log('e====>', e)
          res.send({ message: e.message })
        })
    }
    else if (result === null) {
      createClass.updateOne({ classname: classname, Subject: Subjectname, Chapter: NewContentvalue }, {
        $set: {
          classname: classname,
          [Newcontentname]: NewContentvalue,
          [Newimgpathname]: imageURL,
          Subject: Subjectname,
          SubjectimgPath: '',
          Topic: '',
          TopicimgPath: '',
        }
      }, { upsert: true })
        .then((result) => {
          if (result.length == 0) {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: false })
          } else {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: true, result })
          }
        }).catch(e => {
          // console.log('e====>', e)
          res.send({ message: e.message })
        })
    }

  })
})

router.route('/Addadditionaltopics').post(upload.any(), (req, res) => {

  let imageURL
  for (let key in req.files) {
    console.log('req.files[key]---->', req.files[key])
    if (req.files[key].fieldname === 'Newclasscontentimages') {
      imageURL = req.files[key].path;
    }
  }

  let createClassContent = JSON.parse(req.body.content);
  console.log('createClassContent----->', createClassContent)

  let classname = createClassContent.classname
  let Newcontentname = createClassContent.NewContentname
  let NewContentvalue = createClassContent.NewContentvalue
  let Subjectname = createClassContent.Subjectname
  let Chaptername = createClassContent.Chaptername
  let Newimgpathname = [Newcontentname] + 'imgPath';


  createClass.findOne({ classname: classname, Subject: Subjectname, Chapter: Chaptername, Topic: '' }).then((result) => {

    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' , result)


    if (result) {
      console.log('Chal gaya------------------>')

      createClass.updateOne({ classname: classname, Subject: Subjectname, Chapter: Chaptername, Topic : '' }, {
        $set: {
          classname: classname,
          [Newcontentname]: NewContentvalue,
          [Newimgpathname]: imageURL,
          Subject: Subjectname,
          SubjectimgPath: result.SubjectimgPath,
          Chapter : Chaptername,
          ChapterimgPath : result.ChapterimgPath

        }
      })
        .then((result) => {
          if (result.length == 0) {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: false })
          } else {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: true, result })
          }
        }).catch(e => {
          // console.log('e====>', e)
          res.send({ message: e.message })
        })
    }
    else if (result === null) {
      console.log('Chal gaya------------------>22222222222222')

      createClass.updateOne({ classname: classname, Subject: Subjectname, Chapter: Chaptername , Topic : NewContentvalue}, {
        $set: {
          classname: classname,
          [Newcontentname]: NewContentvalue,
          [Newimgpathname]: imageURL,
          Subject: Subjectname,
          SubjectimgPath: '',
          Chapter: Chaptername,
          ChapterimgPath: '',
        }
      }, { upsert: true })
        .then((result) => {
          if (result.length == 0) {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: false })
          } else {
            // console.log('Resultdelete--->', result)
            res.send({ isSuccess: true, result })
          }
        }).catch(e => {
          // console.log('e====>', e)
          res.send({ message: e.message })
        })
    }
  
  })
})

module.exports = router;
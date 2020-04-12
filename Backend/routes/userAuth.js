const express = require('express');
const router = express.Router();
const userAuth = require('../models/userAuth')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;

//user Signup API
router.post('/Signup', (req, res) => {
  let hash = bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS);

  console.log('hashpass---->',hash)
  const user = req.body
  let newuser = user;
   newuser.password = hash
   console.log('newuser---->' , newuser)
  const newUser = new userAuth(newuser)
  newUser.save().then(() => {
    res.send({ message: 'User Added Successfully', isUser: true })
  }).catch(e => {
    console.log('e====>', e)
    res.send({ message: e.message, isUser: false })
  })
})

let userdata;
router.post('/Login', (req, res) => {
  userAuth.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        userdata = user
        return bcrypt.compare(req.body.password, user.password);
      }

    }).then((samePassword) => {
      if (!samePassword) {
        res.send({ message: 'User Not found', isUser: false })
      }
      console.log('user--->' , userdata)
      res.send({ message: 'User Found', isUser: true ,userdata })
    })
    .catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
   
})

//Forget Pass API
router.post('/forgotPassword', (req, res) => {
  if (req.body.email === '') {
    res.send({ msg: 'email required' });
  }
  console.log('req---->', req.body.email)
  userAuth.findOne({ email: req.body.email }).then((user) => {
    console.log('wtfuser--->', user)
    if (!user || user === null || user === []) {
      console.error('email not in database');
      res.send({ msg: 'email not in db' });
    }
    else {
      const token = crypto.randomBytes(20).toString('hex');
      console.error('updating document !!!');
      console.log('req222---->', req.body.email)
      userAuth.findOneAndUpdate({ email: req.body.email }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }).then((res => console.log('--->Res ', res)))
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '',
          pass: '',
        },
      });
      const mailOptions = {
        from: '',
        to: `${req.body.email}`,
        subject: 'Link To Reset Password',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
          + `http://localhost:3000/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      console.log('sending mail');

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('there was an error: ', err);
        } else {
          console.log('here is the res: ', response);
          res.send({ msg: 'recovery email sent' });
        }
      });
    }
  });
});

//RESET PASSWORD API
router.post('/reset', (req, res) => {
  console.log('req.query.resetPasswordToken', req.body.resetPasswordToken)
  userAuth.findOne({
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).then((user) => {
    if (user == null) {
      console.error('password reset link is invalid or has expired');
      res.send({ msg: 'password reset link is invalid or has expired' });
    } else {
      console.log('reser user--->', user.email)
      res.send({
        username: user.email,
        msg: 'password reset link a-ok',
      });
    }
  });
});

//Update Password API

router.post('/updatePasswordViaEmail', (req, res) => {
  console.log('req.body.email', req.body.email)
  console.log('req.body.resetPasswordToken', req.body.resetPasswordToken)

  userAuth.findOne({
    email: req.body.email,
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).then(user => {
    if (user == null) {
      console.error('password reset link is invalid or has expired');
      res.send({ msg: 'password reset link is invalid or has expired' });
    } else if (user != null) {
      console.log('user exists in db');
      bcrypt
        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
        .then(hashedPassword => {
          console.log('uniqre honi chaiye -->', req.body.email)
          userAuth.findOneAndUpdate({ email: req.body.email }, {
            $set: {
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            }
          }).then((res => console.log('check pass update --->', res)));
        })
        .then(() => {
          console.log('password updated');
          res.send({ msg: 'password updated' });
        });
    } else {
      console.error('no user exists in db to update');
      res.send({ msg: 'no user exists in db to update' });
    }
  });
});


//Fetch All users profiles
router.get('/allusers', (req, res) => {
  userAuth.find()
    .then((result) => {
      if (result.length == 0) {
        res.send({ message: 'Users Not found', isSuccess: false })
      } else {
        res.send({ message: 'Users Found', isSuccess: true, result })
      }
    }).catch(e => {
      console.log('e====>', e)
      res.send({ message: e.message })
    })
})


router.post('/modifyprofile', (req, res) => {
  

  let profiledata = req.body
  console.log('profiledata-------->',profiledata)

  userAuth.findOneAndUpdate({_id : req.body.profileid},{
    $set: {
      class: profiledata.class,
      name : profiledata.name,
      gender : profiledata.gender,
      city : profiledata.city,
      country : profiledata.country,
      age : profiledata.age,
      school : profiledata.school,
      phone : profiledata.phone

    }
  } ,{ new: true }).then((result) => {
    if (result.length == 0) {
      res.send({ message: 'some error!!!', isSuccess: false })
    } else {
      res.send({ message: 'Profile modifies', isSuccess: true, result })
      console.log('modifiedprofile--->' , result)
    }
  }).catch(e => {
    console.log('e====>', e)
    res.send({ message: e.message, isUser: false })
  })
})

module.exports = router;
const express = require('express');
const router = express.Router();
const adminAuth = require('../models/adminauth')
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const BCRYPT_SALT_ROUNDS = 12;


router.post('/Login', (req, res) => {
    console.log('username--->', req.body.username)
    console.log('password--->', req.body.password)

    adminAuth.find()
        .then((user) => {
            console.log('user--->', user)
            if (user.length === 0) {
                let hash = bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS);
                const adminCredentials = req.body;
                adminCredentials.password = hash
                const newAdmin = new adminAuth(adminCredentials)
                newAdmin.save().then(() => {
                    res.send({ message: 'newAdmin Added Successfully', isSuccess: true })
                })
            }
            else {
                adminAuth.findOne({ email: req.body.email }).then((user) => {
                    console.log('userencrypted--->', user)
                    if (user) {
                        return bcrypt.compare(req.body.password, user.password);
                    }

                }).then((samePassword) => {
                    if (!samePassword) {
                        res.send({ message: 'Admin Not found', isSuccess: false })
                    }
                    res.send({ message: 'Admin Found', isSuccess: true })
                })
                    .catch(e => {
                        console.log('samePassworde====>', e)
                        res.send({ message: e.message })
                    })
            }
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
    adminAuth.findOne({ email: req.body.email }).then((user) => {
        console.log('wtfuser--->', user)
        if (!user || user === null || user === []) {
            console.error('email not in database');
            res.send({ msg: 'email not in db' });
        }
        else {
            const token = crypto.randomBytes(20).toString('hex');
            console.error('updating document !!!');
            console.log('req222---->', req.body.email)
            adminAuth.findOneAndUpdate({ email: req.body.email }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }).then((res => console.log('--->Res ', res)))
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'zparacha81@gmail.com',
                    pass: 'mrsaein$$',
                },
            });

            const mailOptions = {
                from: 'zparacha81@gmail.com',
                to: `${req.body.email}`,
                subject: 'Link To Reset Password',
                text:
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
                    + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
                    + `http://localhost:3000/adminreset/${token}\n\n`
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
    adminAuth.findOne({
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

    adminAuth.findOne({
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
                    adminAuth.findOneAndUpdate({ email: req.body.email }, {
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




module.exports = router;
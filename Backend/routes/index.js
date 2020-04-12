
const express = require('express');
const router = express.Router();



// router.use('/Auth', require('./auth'))
router.use('/Auth', require('./userAuth'))
router.use('/Admin', require('./classes'))
router.use('/Admin', require('./FAQ'))
router.use('/Administrator', require('./administrator'))
router.use('/user', require('./bookmark'))
router.use('/user', require('./savesession'))
router.use('/user', require('./cleintresult'))









module.exports = router;

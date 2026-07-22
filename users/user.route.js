const express = require('express');
const {signup, login, checkEmail, profile, loginCheck, editprofile, changePassword} = require('./user.controller');
const router = express.Router();

const catchAsync = require('../utils/catchAsync.utilite');

router.post('/signup', checkEmail, catchAsync(signup));
router.post('/login', login);
router.get('/profile', loginCheck, profile);
router.put('/profile', loginCheck, editprofile);
router.put('/changepassword', loginCheck, changePassword)

module.exports = router;
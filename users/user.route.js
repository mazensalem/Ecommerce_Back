const express = require('express');
const {signup, login, checkEmail, profile, loginCheck, editprofile, changePassword} = require('./user.controller');
const router = express.Router();

const catchAsync = require('../utils/catchAsync.utilite');

router.post('/signup', checkEmail, catchAsync(signup));
router.post('/login', login);
router.get('/profile', loginCheck, profile);
router.patch('/profile', loginCheck, editprofile);
router.patch('/changepassword', loginCheck, changePassword)

module.exports = router;
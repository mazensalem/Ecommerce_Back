const express = require('express');
const {signup, login, checkEmail, profile, loginCheck} = require('./user.controller');
const router = express.Router();

const catchAsync = require('../utils/catchAsync.utilite');

router.post('/signup', checkEmail, catchAsync(signup));
router.post('/login', login);
router.get('/profile', loginCheck, profile);

module.exports = router;
const express = require('express');
const {signup, login, checkEmail} = require('./user.controller');
const router = express.Router();

const catchAsync = require('../utils/catchAsync.utilite');

router.post('/signup', checkEmail, catchAsync(signup));
router.post('/login', login)

module.exports = router;
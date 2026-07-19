const express = require('express');
const {getPages, getPage, createPage, editPage, deletePage} = require('./pages.controller');
const {createTest, setTestStatus, getTests, getApprovedTests, getTestStats} = require('./pages.controller');
const { isAdminLoggedIn } = require('../admins/admins.controller');
const { loginCheck } = require('../users/user.controller');
const router = express.Router();

router.post('/test/create', loginCheck, createTest);
router.get('/test', getApprovedTests);
router.get('/test/all', isAdminLoggedIn, getTests);
router.put('/test/edit/:id', isAdminLoggedIn, setTestStatus);
router.get('/test/stats', isAdminLoggedIn, getTestStats);


router.get('/', getPages);
router.post('/create', isAdminLoggedIn, createPage);
router.put('/edit/:slug', isAdminLoggedIn, editPage);
router.delete('/delete/:slug', isAdminLoggedIn, deletePage);
router.get('/:slug', getPage);



module.exports = router;

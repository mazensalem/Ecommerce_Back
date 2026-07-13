const express = require('express');
const {getAllCatagories, getCatagories, createCatagory, editCatagory, deleteCatagory} = require('./catagories.controller');
const multer = require('../utils/uploads');
const { isAdminLoggedIn } = require('../admins/admins.controller');

const router = express.Router();

router.get('/', getCatagories); // for users
router.get('/all', isAdminLoggedIn, getAllCatagories) // for admins
router.post('/create', isAdminLoggedIn, multer.single('img'), createCatagory);
router.put('/edit/:id', isAdminLoggedIn, multer.single('img'), editCatagory)
router.delete('/delete/:id', isAdminLoggedIn, deleteCatagory);

module.exports = router;

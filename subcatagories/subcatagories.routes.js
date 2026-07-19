const express = require('express');
const {createSubCatagory, getAllSubCatagories, getSubCatagories, editSubCatagory, deleteSubCatagory, getOneSubCatagory, getSubCategoriesUnder} = require('./subcatagores.controller');
const { isAdminLoggedIn } = require('../admins/admins.controller');
const multer = require('../utils/uploads');
const router = express.Router();

router.get('/', getSubCatagories);
router.get('/under/:id', getSubCategoriesUnder);
router.get('/all', isAdminLoggedIn, getAllSubCatagories);
router.post('/add', isAdminLoggedIn, multer.single('img'), createSubCatagory);
router.put('/edit/:id', isAdminLoggedIn, multer.single('img'), editSubCatagory);
router.delete('/delete/:id', isAdminLoggedIn, deleteSubCatagory);
router.get('/:id', getOneSubCatagory);

module.exports = router;

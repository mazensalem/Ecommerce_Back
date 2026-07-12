const express = require('express');
const {getAllCatagories, getCatagories, createCatagory, editCatagory, deleteCatagory} = require('./catagories.controller');
const multer = require('../utils/uploads');

const router = express.Router();

router.get('/', getCatagories); // for users
router.get('/all', getAllCatagories) // for admins
router.post('/create', multer.single('img'), createCatagory);
router.put('/edit/:id', multer.single('img'), editCatagory)
router.delete('/delete/:id', deleteCatagory);

module.exports = router;

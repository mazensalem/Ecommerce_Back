const express = require('express');
const {adminLogin, isAdminLoggedIn, addAdmin, getAllAdmins, editAdmin, deleteAdmin} = require('./admins.controller');

const router = express.Router();

router.post('/login', adminLogin);
router.post('/create', isAdminLoggedIn, addAdmin);
router.get('/', isAdminLoggedIn, getAllAdmins);
router.put('/edit', isAdminLoggedIn, editAdmin);
router.delete('/delete/:id', isAdminLoggedIn, deleteAdmin);


module.exports = router;

const express = require('express');
const router = express.Router();
const { loginCheck } = require('../users/user.controller');
const { getAddress, createAddress, getDefaultAddress, getSingleAddress, updateAddresss, deleteAddress } = require('./address.controller');

router.get('/', loginCheck, getAddress);
router.get('/default', loginCheck, getDefaultAddress);
router.get('/:id', loginCheck, getSingleAddress)
router.post('/', loginCheck, createAddress);
router.put('/:id', loginCheck, updateAddresss);
router.delete('/:id', loginCheck, deleteAddress)

module.exports = router;

const express = require('express');
const {getOrders, createOrder} = require('./order.controller');
const {loginCheck} = require('../users/user.controller');
const router = express.Router();

router.get('/', loginCheck, getOrders);
router.post('/checkout', loginCheck, createOrder);

module.exports = router;
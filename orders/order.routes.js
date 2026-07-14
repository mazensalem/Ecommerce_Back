const express = require('express');
const {getOrders, createOrder, getAllOrders, getOrder, setOrderStatus, cancelOrder} = require('./order.controller');
const {loginCheck} = require('../users/user.controller');
const {isAdminLoggedIn} = require('../admins/admins.controller');
const router = express.Router();

router.get('/', loginCheck, getOrders);
router.get('/all', isAdminLoggedIn, getAllOrders);
router.post('/checkout', loginCheck, createOrder);
router.put('/setstatus/:id', isAdminLoggedIn, setOrderStatus);
router.delete('/delete/:id', loginCheck, cancelOrder);
router.get('/:id', loginCheck, getOrder);

module.exports = router;
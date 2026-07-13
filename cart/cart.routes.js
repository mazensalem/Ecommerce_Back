const express = require('express');
const { loginCheck } = require('../users/user.controller');
const { addProduct, decreaseProduct, clearCart, getCart, validate, removeProduct} = require('./cart.controller');
const router = express.Router();

router.post('/add', loginCheck, addProduct);
router.get('/', loginCheck, getCart);
router.put('/validate', loginCheck, validate);
router.put('/decrease', loginCheck, decreaseProduct);
router.put('/remove', loginCheck, removeProduct);
router.delete('/clear', loginCheck, clearCart);

module.exports = router;


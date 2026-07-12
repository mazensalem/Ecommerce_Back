const express = require('express');
const {getProducts, searchProducts, addProduct, editProduct, deleteProduct} = require('./products.controller');
const multer = require('../utils/uploads');

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.post('/create', multer.single('img'), addProduct);
router.put('/edit/:id', multer.single('img'), editProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
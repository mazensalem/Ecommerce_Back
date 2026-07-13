const express = require('express');
const {getProducts, searchProducts, addProduct, editProduct, deleteProduct, getProduct} = require('./products.controller');
const multer = require('../utils/uploads');

const router = express.Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.post('/create', multer.single('img'), addProduct);
router.put('/edit/:id', multer.single('img'), editProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/:id', getProduct);

module.exports = router;
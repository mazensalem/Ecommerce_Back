const express = require('express');
const {getProducts, searchProducts, addProduct, editProduct, deleteProduct, getProduct, setNewArrivals, setMostPopular, bestSeller} = require('./products.controller');
const multer = require('../utils/uploads');
const { isAdminLoggedIn } = require('../admins/admins.controller');

const router = express.Router();

router.get('/', isAdminLoggedIn, getProducts); // for admin, user can search with '' string
router.get('/search', searchProducts);
router.get('/bestseller', bestSeller);
router.post('/create', isAdminLoggedIn, multer.single('img'), addProduct);
router.put('/edit/:id', isAdminLoggedIn, multer.single('img'), editProduct);
router.delete('/delete/:id', isAdminLoggedIn, deleteProduct);
router.get('/:slug', getProduct);
router.post('/setnewarrivals/:id', isAdminLoggedIn, setNewArrivals);
router.post('/setmostpopular/:id', isAdminLoggedIn, setMostPopular);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getStats, latestOrders, lowStockProducts } = require('./reports.controller');
const { isAdminLoggedIn } = require('../admins/admins.controller');

router.get('/stats', isAdminLoggedIn, getStats);
router.get('/latestorders', isAdminLoggedIn, latestOrders);
router.get('/lowstockproducts', isAdminLoggedIn, lowStockProducts)

module.exports = router

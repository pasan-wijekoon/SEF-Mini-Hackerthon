const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const listingRoutes = require('./listingRoutes');

// Mount health routes
router.use('/', healthRoutes);
router.use('/v1', healthRoutes);

// Mount listings routes for both /api/v1/listings and /api/listings
router.use('/v1/listings', listingRoutes);
router.use('/listings', listingRoutes);

module.exports = router;

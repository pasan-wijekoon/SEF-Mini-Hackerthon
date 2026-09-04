const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const listingRoutes = require('./listingRoutes');
const assistantRoutes = require('./assistantRoutes');

// Mount health routes
router.use('/', healthRoutes);
router.use('/v1', healthRoutes);

// Mount listings routes for both /api/v1/listings and /api/listings
router.use('/v1/listings', listingRoutes);
router.use('/listings', listingRoutes);

// AI donation assistant, for both /api/v1/assistant and /api/assistant
router.use('/v1/assistant', assistantRoutes);
router.use('/assistant', assistantRoutes);

// Listings + stats routes require models/Listing.js (Member 3), which doesn't exist
// yet — requiring listings.routes.js / listings.controller.js before that lands
// crashes the server at boot. Uncomment both lines below once the model is added.
// const listingsRoutes = require('./listings.routes');
// const { getStats } = require('../controllers/listings.controller');
// router.use('/listings', listingsRoutes);
// router.get('/stats', getStats);

module.exports = router;

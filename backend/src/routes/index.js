const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const listingRoutes = require('./listingRoutes');
const assistantRoutes = require('./assistantRoutes');
const listingsActionsRoutes = require('./listings.routes');
const { getStats } = require('../controllers/listings.controller');

// Mount health routes
router.use('/', healthRoutes);
router.use('/v1', healthRoutes);

// Mount listings routes for both /api/v1/listings and /api/listings
// Core (GET/POST) from Member 3's listingRoutes, actions (PATCH/DELETE) from
// Member 4's listings.routes — both mounted at the same prefix, no method overlap.
router.use('/v1/listings', listingRoutes);
router.use('/v1/listings', listingsActionsRoutes);
router.use('/listings', listingRoutes);
router.use('/listings', listingsActionsRoutes);

// Aggregate stats for the landing page
router.get('/v1/stats', getStats);
router.get('/stats', getStats);

// AI donation assistant, for both /api/v1/assistant and /api/assistant
router.use('/v1/assistant', assistantRoutes);
router.use('/assistant', assistantRoutes);

module.exports = router;

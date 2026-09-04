const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/', healthRoutes);

// Listings + stats routes require models/Listing.js (Member 3), which doesn't exist
// yet — requiring listings.routes.js / listings.controller.js before that lands
// crashes the server at boot. Uncomment both lines below once the model is added.
// const listingsRoutes = require('./listings.routes');
// const { getStats } = require('../controllers/listings.controller');
// router.use('/listings', listingsRoutes);
// router.get('/stats', getStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createListing,
  getAllListings,
  getListingById,
} = require('../controllers/listingController');
const validateListing = require('../middlewares/validateListing');

// Core API endpoints (Member 3)
router
  .route('/')
  .post(validateListing, createListing)
  .get(getAllListings);

router
  .route('/:id')
  .get(getListingById);

module.exports = router;

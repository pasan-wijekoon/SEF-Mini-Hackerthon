const express = require('express');
const router = express.Router();
const { updateListing, claimListing, deleteListing } = require('../controllers/listings.controller');

// NOTE: GET / , GET /:id , POST / are owned by Member 3 (core API) and should be added here.

router.patch('/:id/claim', claimListing);
router.patch('/:id', updateListing);
router.delete('/:id', deleteListing);

module.exports = router;

const Listing = require('../models/Listing');

// Wraps an async controller so rejected promises reach the error handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Update a listing (donor edits fields, or cancels via status)
// @route   PATCH /api/v1/listings/:id
// @access  Public
const updateListing = asyncHandler(async (req, res, next) => {
  const updates = { ...req.body };
  delete updates.status;
  delete updates.claimedBy;
  delete updates.claimedAt;

  const listing = await Listing.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, data: listing });
});

// @desc    Claim a listing
// @route   PATCH /api/v1/listings/:id/claim
// @access  Public
const claimListing = asyncHandler(async (req, res, next) => {
  const { claimedBy } = req.body;

  if (!claimedBy || !claimedBy.trim()) {
    const error = new Error('claimedBy is required to claim a listing');
    error.statusCode = 400;
    return next(error);
  }

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    return next(error);
  }

  if (listing.status !== 'available') {
    const error = new Error('This listing is no longer available');
    error.statusCode = 409;
    return next(error);
  }

  listing.status = 'claimed';
  listing.claimedBy = claimedBy;
  listing.claimedAt = new Date();
  await listing.save();

  res.status(200).json({ success: true, data: listing });
});

// @desc    Delete (cancel) a listing permanently
// @route   DELETE /api/v1/listings/:id
// @access  Public
const deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);

  if (!listing) {
    const error = new Error('Listing not found');
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get aggregate listing counts for landing page stats
// @route   GET /api/v1/stats
// @access  Public
const getStats = asyncHandler(async (req, res) => {
  const counts = await Listing.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const data = { total: 0, available: 0, claimed: 0, expired: 0, cancelled: 0 };
  counts.forEach(({ _id, count }) => {
    data[_id] = count;
    data.total += count;
  });

  res.status(200).json({ success: true, data });
});

module.exports = {
  updateListing,
  claimListing,
  deleteListing,
  getStats,
};

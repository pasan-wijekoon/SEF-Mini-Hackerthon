const mongoose = require('mongoose');
const Listing = require('../models/Listing');

/**
 * @desc    Create a new food listing
 * @route   POST /api/v1/listings
 * @access  Public (Donor)
 */
const createListing = async (req, res, next) => {
  try {
    const {
      donorName,
      donorType,
      foodItem,
      quantity,
      quantityUnit,
      forWhom,
      location,
      pickupWindowStart,
      pickupWindowEnd,
      contactNumber,
      notes,
    } = req.body;

    const listing = await Listing.create({
      donorName: donorName.trim(),
      donorType,
      foodItem: foodItem.trim(),
      quantity: Number(quantity),
      quantityUnit,
      forWhom,
      location: location.trim(),
      pickupWindowStart: new Date(pickupWindowStart),
      pickupWindowEnd: new Date(pickupWindowEnd),
      contactNumber: contactNumber.trim(),
      notes: notes ? notes.trim() : '',
      status: 'available',
    });

    return res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all listings with optional filtering
 * @route   GET /api/v1/listings
 * @access  Public
 * @query   foodType, location, forWhom, status, donor
 */
const getAllListings = async (req, res, next) => {
  try {
    const { foodType, location, forWhom, status, donor } = req.query;

    const filter = {};

    // Filter by foodType (case-insensitive substring match on foodItem)
    if (foodType && foodType.trim() !== '') {
      filter.foodItem = { $regex: foodType.trim(), $options: 'i' };
    }

    // Filter by location (case-insensitive substring match)
    if (location && location.trim() !== '') {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter by forWhom (exact match: people | animals | both)
    if (forWhom && ['people', 'animals', 'both'].includes(forWhom)) {
      filter.forWhom = forWhom;
    }

    // Filter by status (available | claimed | expired | cancelled)
    if (status && ['available', 'claimed', 'expired', 'cancelled'].includes(status)) {
      filter.status = status;
    }

    // Filter by donor (exact match or search)
    if (donor && donor.trim() !== '') {
      filter.donorName = { $regex: donor.trim(), $options: 'i' };
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single listing by ID
 * @route   GET /api/v1/listings/:id
 * @access  Public
 */
const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
};

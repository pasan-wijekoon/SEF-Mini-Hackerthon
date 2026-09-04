const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, "Please provide donor name"],
      trim: true,
    },
    donorType: {
      type: String,
      enum: {
        values: ['hotel', 'bakery', 'restaurant', 'household', 'other'],
        message: '{VALUE} is not a valid donor type',
      },
      required: [true, "Please provide donor type"],
    },
    foodItem: {
      type: String,
      required: [true, "Please provide food item"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      min: [1, "Quantity must be at least 1"],
    },
    quantityUnit: {
      type: String,
      enum: {
        values: ['kg', 'packets', 'plates', 'loaves', 'items'],
        message: '{VALUE} is not a valid quantity unit',
      },
      required: [true, "Please provide quantity unit"],
    },
    forWhom: {
      type: String,
      enum: {
        values: ['people', 'animals', 'both'],
        message: '{VALUE} is not a valid beneficiary category',
      },
      required: [true, "Please specify who this food is for"],
    },
    location: {
      type: String,
      required: [true, "Please provide location"],
      trim: true,
    },
    pickupWindowStart: {
      type: Date,
      required: [true, "Please provide pickup window start time"],
    },
    pickupWindowEnd: {
      type: Date,
      required: [true, "Please provide pickup window end time"],
    },
    contactNumber: {
      type: String,
      required: [true, "Please provide contact number"],
      match: [/^(?:\+94|0)[0-9]{9}$/, "Please enter a valid Sri Lankan phone number"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'claimed', 'expired', 'cancelled'],
        message: '{VALUE} is not a valid listing status',
      },
      default: 'available',
    },
    claimedBy: {
      type: String,
      trim: true,
    },
    claimedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up filtered searches
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ forWhom: 1 });
listingSchema.index({ foodItem: 'text', location: 'text' });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

/**
 * Validation middleware for creating listings per PRD §11 & §12.
 */
const validateListing = (req, res, next) => {
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
  } = req.body;

  const errors = [];

  // donorName validation
  if (!donorName || typeof donorName !== 'string' || donorName.trim().length < 2) {
    errors.push({
      field: 'donorName',
      message: "Please tell us who's donating.",
    });
  }

  // donorType validation
  const validDonorTypes = ['hotel', 'bakery', 'restaurant', 'household', 'other'];
  if (!donorType || !validDonorTypes.includes(donorType)) {
    errors.push({
      field: 'donorType',
      message: 'Please select a valid donor type.',
    });
  }

  // foodItem validation
  if (!foodItem || typeof foodItem !== 'string' || foodItem.trim().length === 0) {
    errors.push({
      field: 'foodItem',
      message: 'What food are you donating?',
    });
  }

  // quantity validation
  const numQuantity = Number(quantity);
  if (quantity === undefined || quantity === null || isNaN(numQuantity) || numQuantity <= 0) {
    errors.push({
      field: 'quantity',
      message: 'Quantity must be a positive number.',
    });
  }

  // quantityUnit validation
  const validQuantityUnits = ['kg', 'packets', 'plates', 'loaves', 'items'];
  if (!quantityUnit || !validQuantityUnits.includes(quantityUnit)) {
    errors.push({
      field: 'quantityUnit',
      message: 'Please select a valid quantity unit.',
    });
  }

  // forWhom validation
  const validForWhom = ['people', 'animals', 'both'];
  if (!forWhom || !validForWhom.includes(forWhom)) {
    errors.push({
      field: 'forWhom',
      message: 'Please select who this food is for.',
    });
  }

  // location validation
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.push({
      field: 'location',
      message: 'Where can this be picked up?',
    });
  }

  // pickupWindowStart validation
  let startDate;
  if (!pickupWindowStart) {
    errors.push({
      field: 'pickupWindowStart',
      message: 'Pickup start time is required.',
    });
  } else {
    startDate = new Date(pickupWindowStart);
    if (isNaN(startDate.getTime())) {
      errors.push({
        field: 'pickupWindowStart',
        message: 'Enter a valid pickup start date/time.',
      });
    }
  }

  // pickupWindowEnd validation
  if (!pickupWindowEnd) {
    errors.push({
      field: 'pickupWindowEnd',
      message: 'Pickup end time is required.',
    });
  } else {
    const endDate = new Date(pickupWindowEnd);
    if (isNaN(endDate.getTime())) {
      errors.push({
        field: 'pickupWindowEnd',
        message: 'Enter a valid pickup end date/time.',
      });
    } else if (startDate && !isNaN(startDate.getTime()) && endDate <= startDate) {
      errors.push({
        field: 'pickupWindowEnd',
        message: 'Pickup end time must be after the start time.',
      });
    }
  }

  // contactNumber validation
  const phoneRegex = /^(?:\+94|0)[0-9]{9}$/;
  if (!contactNumber || typeof contactNumber !== 'string' || !phoneRegex.test(contactNumber.trim())) {
    errors.push({
      field: 'contactNumber',
      message: 'Enter a valid Sri Lankan phone number, e.g. 0771234567.',
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};

module.exports = validateListing;

require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

const seedData = [
  {
    donorName: 'Perera Bakery',
    donorType: 'bakery',
    foodItem: 'Fresh Bread Loaves',
    quantity: 20,
    quantityUnit: 'loaves',
    forWhom: 'both',
    location: 'Ratnapura Town',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 30), // 30 mins from now
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
    contactNumber: '0771234567',
    notes: 'Baked this morning, freshly packed in paper bags.',
    status: 'available',
  },
  {
    donorName: 'Green Leaf Hotel',
    donorType: 'hotel',
    foodItem: 'Rice & Curry Packets',
    quantity: 15,
    quantityUnit: 'packets',
    forWhom: 'people',
    location: 'Colombo 6',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 15),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 3),
    contactNumber: '0712345678',
    notes: 'Includes chicken curry, dhal, and gotukola sambol. Packed warm.',
    status: 'available',
  },
  {
    donorName: 'Sunrise Restaurant',
    donorType: 'restaurant',
    foodItem: 'Cooked Vegetable Trimmings & Rice',
    quantity: 8,
    quantityUnit: 'kg',
    forWhom: 'animals',
    location: 'Kandy',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 45),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 5),
    contactNumber: '0753456789',
    notes: 'Suitable for animal shelter feeding or community dogs/cats.',
    status: 'available',
  },
  {
    donorName: 'Mount Bakers',
    donorType: 'bakery',
    foodItem: 'Cakes & Pastries',
    quantity: 30,
    quantityUnit: 'items',
    forWhom: 'people',
    location: 'Nugegoda',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 60),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 6),
    contactNumber: '0764567890',
    notes: 'Assorted iced cupcakes and savoury pastries.',
    status: 'available',
  },
  {
    donorName: 'Ocean View Hotel',
    donorType: 'hotel',
    foodItem: 'Buffet Surplus Dishes',
    quantity: 10,
    quantityUnit: 'kg',
    forWhom: 'both',
    location: 'Galle',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 20),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 3),
    contactNumber: '0785678901',
    notes: 'Clean surplus from evening banquet. Stored refrigerated.',
    status: 'available',
  },
  {
    donorName: 'Royal Palace Caterers',
    donorType: 'restaurant',
    foodItem: 'Chicken & Veg Fried Rice',
    quantity: 25,
    quantityUnit: 'packets',
    forWhom: 'people',
    location: 'Kurunegala',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 10),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4),
    contactNumber: '0706789012',
    notes: 'Freshly prepared event surplus, individually boxed with chili paste.',
    status: 'available',
  },
  {
    donorName: 'Jaffna Heritage Kitchen',
    donorType: 'restaurant',
    foodItem: 'Steamed Rice & Dhal Curry',
    quantity: 12,
    quantityUnit: 'kg',
    forWhom: 'both',
    location: 'Jaffna',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 30),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4),
    contactNumber: '0777890123',
    notes: 'Nutritious cooked meal, please bring containers for bulk transport.',
    status: 'available',
  },
  {
    donorName: 'Negombo Lagoon Bistro',
    donorType: 'restaurant',
    foodItem: 'Seafood Rice & Side Dishes',
    quantity: 18,
    quantityUnit: 'plates',
    forWhom: 'people',
    location: 'Negombo',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 40),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4),
    contactNumber: '0728901234',
    notes: 'Portioned lunch packs ready for immediate pickup.',
    status: 'available',
  },
  {
    donorName: 'Hill Country Inn',
    donorType: 'hotel',
    foodItem: 'Vegetable Stew & Potato Mash',
    quantity: 10,
    quantityUnit: 'kg',
    forWhom: 'animals',
    location: 'Nuwara Eliya',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 60),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 6),
    contactNumber: '0719012345',
    notes: 'Cooked without harmful spices, ideal for dog / animal shelters.',
    status: 'available',
  },
  {
    donorName: 'Matara City Bakery',
    donorType: 'bakery',
    foodItem: 'Vegetable Buns & Rolls',
    quantity: 40,
    quantityUnit: 'items',
    forWhom: 'people',
    location: 'Matara',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 15),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 3),
    contactNumber: '0760123456',
    notes: 'Freshly baked evening surplus.',
    status: 'available',
  },
  {
    donorName: 'Anuradhapura Pilgrim Rest',
    donorType: 'hotel',
    foodItem: 'Vegetarian Meal Packets',
    quantity: 50,
    quantityUnit: 'packets',
    forWhom: 'people',
    location: 'Anuradhapura',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 30),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 5),
    contactNumber: '0771122334',
    notes: 'Dansala surplus, hygienically packed.',
    status: 'available',
  },
  {
    donorName: 'Kandy Lake Cafe',
    donorType: 'bakery',
    foodItem: 'Egg Sandwiches & Veg Puffs',
    quantity: 15,
    quantityUnit: 'items',
    forWhom: 'both',
    location: 'Kandy',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 20),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 60 * 4),
    contactNumber: '0752233445',
    notes: 'Packed in clean cartons, ready for collection.',
    status: 'available',
  },
];

const seedListings = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodshare';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing listings
    await Listing.deleteMany({});
    console.log('[Seed] Cleared existing listings');

    // Insert sample listings
    const inserted = await Listing.insertMany(seedData);
    console.log(`[Seed] Successfully seeded ${inserted.length} sample listings!`);

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed');
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

// If run directly via command line
if (require.main === module) {
  seedListings();
}

module.exports = { seedData, seedListings };

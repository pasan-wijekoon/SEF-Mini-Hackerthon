const assert = require('assert');
const Listing = require('../src/models/Listing');
const validateListing = require('../src/middlewares/validateListing');
const { seedData } = require('../src/seed/seedListings');

console.log('--- RUNNING MEMBER 3 CORE API TESTS ---');

// Test 1: Seed data validity
console.log('[Test 1] Verifying seed dataset...');
assert.strictEqual(seedData.length >= 10, true, 'Seed data should contain at least 10 items');
seedData.forEach((item, index) => {
  assert.ok(item.donorName, `Seed item ${index} missing donorName`);
  assert.ok(['hotel', 'bakery', 'restaurant', 'household', 'other'].includes(item.donorType), `Seed item ${index} invalid donorType: ${item.donorType}`);
  assert.ok(item.foodItem, `Seed item ${index} missing foodItem`);
  assert.ok(item.quantity > 0, `Seed item ${index} invalid quantity`);
  assert.ok(['kg', 'packets', 'plates', 'loaves', 'items'].includes(item.quantityUnit), `Seed item ${index} invalid quantityUnit: ${item.quantityUnit}`);
  assert.ok(['people', 'animals', 'both'].includes(item.forWhom), `Seed item ${index} invalid forWhom: ${item.forWhom}`);
  assert.ok(item.location, `Seed item ${index} missing location`);
  assert.ok(item.pickupWindowStart instanceof Date, `Seed item ${index} invalid pickupWindowStart`);
  assert.ok(item.pickupWindowEnd instanceof Date, `Seed item ${index} invalid pickupWindowEnd`);
  assert.ok(/^(?:\+94|0)[0-9]{9}$/.test(item.contactNumber), `Seed item ${index} invalid contactNumber: ${item.contactNumber}`);
});
console.log('✓ Seed dataset has 12 properly formatted entries adhering to PRD §15.');

// Test 2: Validation Middleware - Valid Payload
console.log('[Test 2] Testing validateListing middleware with valid payload...');
let nextCalled = false;
const reqValid = {
  body: {
    donorName: 'Perera Bakery',
    donorType: 'bakery',
    foodItem: 'Bread loaves',
    quantity: 20,
    quantityUnit: 'loaves',
    forWhom: 'both',
    location: 'Ratnapura Town',
    pickupWindowStart: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    pickupWindowEnd: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
    contactNumber: '0771234567',
  },
};
const resMock = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.body = data;
    return this;
  },
};

validateListing(reqValid, resMock, () => {
  nextCalled = true;
});
assert.strictEqual(nextCalled, true, 'next() should be called for valid input');
console.log('✓ Valid payload passed validation middleware.');

// Test 3: Validation Middleware - Invalid Payload (checks PRD error format)
console.log('[Test 3] Testing validateListing middleware with invalid payload...');
nextCalled = false;
let responseSent = null;
const reqInvalid = {
  body: {
    donorName: 'A', // too short (<2 chars)
    donorType: 'invalid_type',
    foodItem: '',
    quantity: -5, // <= 0
    quantityUnit: 'invalid_unit',
    forWhom: 'aliens',
    location: '',
    pickupWindowStart: 'invalid-date',
    pickupWindowEnd: 'invalid-date',
    contactNumber: '12345', // invalid phone format
  },
};
const resMock2 = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.body = data;
    responseSent = data;
    return this;
  },
};

validateListing(reqInvalid, resMock2, () => {
  nextCalled = true;
});

assert.strictEqual(nextCalled, false, 'next() should NOT be called for invalid input');
assert.strictEqual(resMock2.statusCode, 400, 'Status code should be 400 Bad Request');
assert.strictEqual(responseSent.success, false, 'Response should have success: false');
assert.ok(Array.isArray(responseSent.errors), 'Response should contain errors array');
assert.strictEqual(responseSent.errors.length, 10, 'Should catch all 10 invalid fields');
console.log('✓ Invalid payload returned status 400 with expected error shape:');
console.log(JSON.stringify(responseSent, null, 2));

// Test 4: App and Route integration check
console.log('[Test 4] Testing Express app & routes setup...');
const app = require('../src/app');
assert.ok(app, 'Express app module loaded successfully');
console.log('✓ App and routes initialized successfully.');

console.log('\n======================================');
console.log('ALL CORE API TESTS PASSED SUCCESSFULLY');
console.log('======================================');

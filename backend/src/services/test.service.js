
const Test = require('../models/Test');
const Student = require('../models/Student');
const testQueryService = require('./test/test-query.service');
const testCreationService = require('./test/test-creation.service');
const testDeliveryService = require('./test/test-delivery.service');
const testUpdateService = require('./test/test-update.service');

// Get all tests for a user
const getUserTests = async (userId) => {
  return testQueryService.getUserTests(userId);
};

// Get a single test by ID
const getTestById = async (testId, userId) => {
  return testQueryService.getTestById(testId, userId);
};

// Create a test manually
const createManualTest = async (testData, userId) => {
  return testCreationService.createManualTest(testData, userId);
};

// Generate a test with OpenAI
const generateTest = async (data, userId) => {
  return testCreationService.generateTest(data, userId);
};

// Generate PDF and send test by email
const sendTest = async (testId, userId, logger) => {
  return testDeliveryService.sendTest(testId, userId, logger);
};

// Generate and send test in one step
const generateAndSendTest = async (data, userId, logger) => {
  return testDeliveryService.generateAndSendTest(data, userId, logger);
};

// Update a test
const updateTest = async (testId, userId, updateData) => {
  return testUpdateService.updateTest(testId, userId, updateData);
};

// Delete a test
const deleteTest = async (testId, userId) => {
  return testUpdateService.deleteTest(testId, userId);
};

module.exports = {
  getUserTests,
  getTestById,
  createManualTest,
  generateTest,
  sendTest,
  generateAndSendTest,
  updateTest,
  deleteTest
};

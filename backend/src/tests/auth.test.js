
const request = require('supertest');
const express = require('express');
const authController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(() => true)
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token')
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      // Setup mock
      const User = require('../models/User');
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, email: 'test@example.com' });
      
      // Send request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
    
    test('should return 400 if user already exists', async () => {
      // Setup mock
      const User = require('../models/User');
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });
      
      // Send request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      
      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });
  
  describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      // Setup mock
      const User = require('../models/User');
      User.findOne.mockResolvedValue({ 
        id: 1, 
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user'
      });
      
      // Send request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
    
    test('should return 401 with invalid credentials', async () => {
      // Setup mock
      const User = require('../models/User');
      User.findOne.mockResolvedValue(null);
      
      // Send request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });
      
      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});

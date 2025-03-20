
const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  refreshToken,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Rutas protegidas
router.get('/profile', authenticate, getProfile);

module.exports = router;

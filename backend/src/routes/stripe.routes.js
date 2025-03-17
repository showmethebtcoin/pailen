
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { 
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription
} = require('../controllers/stripe.controller');

const router = express.Router();

// Ruta pública para webhook de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Rutas protegidas que requieren autenticación
router.use(authenticate);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/subscription-status', getSubscriptionStatus);
router.post('/cancel-subscription', cancelSubscription);

module.exports = router;

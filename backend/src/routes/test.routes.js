
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { 
  getAllTests, 
  getTestById, 
  createTest,
  generateTest,
  sendTest,
  updateTest,
  deleteTest
} = require('../controllers/test.controller');

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authenticate);

// Rutas CRUD para tests
router.get('/', getAllTests);
router.get('/:id', getTestById);
router.post('/', createTest);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

// Rutas específicas para generación y envío
router.post('/generate', generateTest);
router.post('/send', sendTest);

module.exports = router;

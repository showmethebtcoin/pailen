
const testService = require('../services/test.service');

// Get all tests for the authenticated user
const getAllTests = async (req, res) => {
  try {
    const tests = await testService.getUserTests(req.user.id);
    res.json(tests);
  } catch (error) {
    req.logger.error('Error al obtener tests:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Get a test by ID
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await testService.getTestById(id, req.user.id);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.json(result.test);
  } catch (error) {
    req.logger.error('Error al obtener test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Create a new test manually
const createTest = async (req, res) => {
  try {
    const result = await testService.createManualTest(req.body, req.user.id);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.status(201).json(result.test);
  } catch (error) {
    req.logger.error('Error al crear test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generate a test with OpenAI
const generateTest = async (req, res) => {
  try {
    const result = await testService.generateTest(req.body, req.user.id);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.status(201).json(result.test);
  } catch (error) {
    req.logger.error('Error al generar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Send a test by email
const sendTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const result = await testService.sendTest(testId, req.user.id, req.logger);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.json({ 
      message: 'Test enviado correctamente',
      test: result.test
    });
  } catch (error) {
    req.logger.error('Error al enviar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generate and send test in one step
const generateAndSendTest = async (req, res) => {
  try {
    const result = await testService.generateAndSendTest(req.body, req.user.id, req.logger);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.status(201).json({ 
      message: 'Test generado y enviado correctamente',
      test: result.test
    });
  } catch (error) {
    req.logger.error('Error al generar y enviar test:', error);
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Update a test
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await testService.updateTest(id, req.user.id, req.body);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.json(result.test);
  } catch (error) {
    req.logger.error('Error al actualizar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Delete a test
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await testService.deleteTest(id, req.user.id);
    
    if (result.error) {
      return res.status(result.statusCode).json({ message: result.error });
    }
    
    res.json({ message: 'Test eliminado correctamente' });
  } catch (error) {
    req.logger.error('Error al eliminar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllTests,
  getTestById,
  createTest,
  generateTest,
  sendTest,
  generateAndSendTest,
  updateTest,
  deleteTest
};

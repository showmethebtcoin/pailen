
const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas de estudiantes
router.use(authenticate);

// Rutas CRUD para estudiantes
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;

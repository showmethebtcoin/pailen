
const express = require('express');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentLessonTopic,
  getStudentLessonTopic,
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

// Rutas para tema de próxima clase
router.get('/:id/topic', getStudentLessonTopic);
router.post('/:id/topic', updateStudentLessonTopic);

module.exports = router;


const request = require('supertest');
const express = require('express');
const studentController = require('../controllers/student.controller');
const authMiddleware = require('../middleware/auth');

// Mock models and middleware
jest.mock('../models/Student', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('../middleware/auth', () => (req, res, next) => {
  req.user = { id: 1, role: 'admin' };
  next();
});

// Create express app for testing
const app = express();
app.use(express.json());
app.get('/api/students', authMiddleware, studentController.getAllStudents);
app.get('/api/students/:id', authMiddleware, studentController.getStudentById);
app.post('/api/students', authMiddleware, studentController.createStudent);
app.put('/api/students/:id', authMiddleware, studentController.updateStudent);
app.delete('/api/students/:id', authMiddleware, studentController.deleteStudent);

describe('Student Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GET /api/students', () => {
    test('should get all students', async () => {
      // Setup mock
      const Student = require('../models/Student');
      Student.findAll.mockResolvedValue([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]);
      
      // Send request
      const response = await request(app).get('/api/students');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(Student.findAll).toHaveBeenCalled();
    });
  });
  
  describe('POST /api/students', () => {
    test('should create a new student', async () => {
      // Setup mock
      const Student = require('../models/Student');
      Student.create.mockResolvedValue({ 
        id: 3, 
        name: 'New Student', 
        email: 'new@example.com',
        language: 'es',
        level: 'beginner' 
      });
      
      // Send request
      const response = await request(app)
        .post('/api/students')
        .send({
          name: 'New Student',
          email: 'new@example.com',
          language: 'es',
          level: 'beginner'
        });
      
      // Assertions
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 3);
      expect(Student.create).toHaveBeenCalledWith({
        name: 'New Student',
        email: 'new@example.com',
        language: 'es',
        level: 'beginner'
      });
    });
  });
  
  describe('PUT /api/students/:id', () => {
    test('should update an existing student', async () => {
      // Setup mock
      const Student = require('../models/Student');
      Student.findByPk.mockResolvedValue({ id: 1, update: jest.fn() });
      Student.update.mockResolvedValue([1]);
      
      // Send request
      const response = await request(app)
        .put('/api/students/1')
        .send({
          name: 'Updated Name',
          level: 'advanced'
        });
      
      // Assertions
      expect(response.status).toBe(200);
      expect(Student.update).toHaveBeenCalled();
    });
  });
  
  describe('DELETE /api/students/:id', () => {
    test('should delete a student', async () => {
      // Setup mock
      const Student = require('../models/Student');
      Student.findByPk.mockResolvedValue({ id: 1 });
      Student.destroy.mockResolvedValue(1);
      
      // Send request
      const response = await request(app).delete('/api/students/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(Student.destroy).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Student deleted successfully');
    });
  });
});

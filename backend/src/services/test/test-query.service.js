
const Test = require('../../models/Test');
const Student = require('../../models/Student');

// Get all tests for a user
const getUserTests = async (userId) => {
  // Find students of the user
  const students = await Student.findAll({
    where: { userId },
    attributes: ['id']
  });
  
  const studentIds = students.map(student => student.id);
  
  // Find tests associated with those students
  return Test.findAll({
    where: { studentId: studentIds },
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email', 'language', 'level']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Get a single test by ID
const getTestById = async (testId, userId) => {
  const test = await Test.findByPk(testId, {
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email', 'language', 'level', 'userId']
      }
    ]
  });
  
  if (!test) {
    return { error: 'Test no encontrado', statusCode: 404 };
  }
  
  // Verify the test belongs to a student of the user
  if (test.student.userId !== userId) {
    return { error: 'No autorizado', statusCode: 403 };
  }
  
  return { test };
};

module.exports = {
  getUserTests,
  getTestById
};

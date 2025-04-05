
const Test = require('../../models/Test');
const Student = require('../../models/Student');

// Update a test
const updateTest = async (testId, userId, updateData) => {
  const { title, content } = updateData;
  
  // Find the test
  const test = await Test.findByPk(testId, {
    include: [{
      model: Student,
      as: 'student',
      attributes: ['userId']
    }]
  });
  
  if (!test) {
    return { error: 'Test no encontrado', statusCode: 404 };
  }
  
  // Verify the test belongs to a student of the user
  if (test.student.userId !== userId) {
    return { error: 'No autorizado', statusCode: 403 };
  }
  
  // Update test
  await test.update({
    title: title || test.title,
    content: content || test.content
  });
  
  return { test };
};

// Delete a test
const deleteTest = async (testId, userId) => {
  // Find the test
  const test = await Test.findByPk(testId, {
    include: [{
      model: Student,
      as: 'student',
      attributes: ['userId']
    }]
  });
  
  if (!test) {
    return { error: 'Test no encontrado', statusCode: 404 };
  }
  
  // Verify the test belongs to a student of the user
  if (test.student.userId !== userId) {
    return { error: 'No autorizado', statusCode: 403 };
  }
  
  // Delete test
  await test.destroy();
  
  return { success: true };
};

module.exports = {
  updateTest,
  deleteTest
};

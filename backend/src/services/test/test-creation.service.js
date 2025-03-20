
const Test = require('../../models/Test');
const Student = require('../../models/Student');
const { generateOpenAITest } = require('../openai.service');

// Create a test manually
const createManualTest = async (testData, userId) => {
  const { studentId, title, language, level, content } = testData;
  
  // Verify the student belongs to the user
  const student = await Student.findByPk(studentId);
  if (!student || student.userId !== userId) {
    return { error: 'No autorizado para crear test para este estudiante', statusCode: 403 };
  }
  
  const test = await Test.create({
    studentId,
    title,
    language,
    level,
    content,
    status: 'draft'
  });
  
  return { test };
};

// Generate a test with OpenAI
const generateTest = async (data, userId) => {
  const { studentId, options } = data;
  
  // Verify the student belongs to the user
  const student = await Student.findByPk(studentId);
  if (!student || student.userId !== userId) {
    return { error: 'No autorizado para generar test para este estudiante', statusCode: 403 };
  }
  
  // Add the student name to the options
  const testOptions = {
    ...options,
    studentName: student.name
  };
  
  // Generate content with OpenAI
  const content = await generateOpenAITest(testOptions);
  
  // Create the new test
  const test = await Test.create({
    studentId,
    title: `${options.language} Test - Level ${options.level}`,
    language: options.language,
    level: options.level,
    content,
    status: 'draft'
  });
  
  return { test };
};

module.exports = {
  createManualTest,
  generateTest
};


const Test = require('../../models/Test');
const Student = require('../../models/Student');
const { generatePDF } = require('../pdf.service');
const { sendTestByEmail } = require('../email.service');
const { generateOpenAITest } = require('../openai.service');
const fs = require('fs');

// Generate PDF and send test by email
const sendTest = async (testId, userId, logger) => {
  // Find the test
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
  
  let pdfPath = null;
  
  // Try to generate PDF, but if it fails, continue without it
  try {
    if (process.env.ENABLE_PDF_GENERATION === 'true') {
      const pdfResult = await generatePDF(test.content, {
        title: test.title,
        studentName: test.student.name,
        language: test.language,
        level: test.level
      });
      pdfPath = pdfResult.path;
    }
  } catch (error) {
    logger.warn('Error al generar PDF, continuando sin PDF:', error);
    // Continue without PDF
  }
  
  // Send email (with or without PDF attachment)
  await sendTestByEmail(test.student, test, pdfPath);
  
  // Delete the temporary file if it exists
  if (pdfPath && fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }
  
  // Update test status
  await test.update({
    status: 'sent',
    sentAt: new Date()
  });
  
  return { test };
};

// Generate and send test in one step
const generateAndSendTest = async (data, userId, logger) => {
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
  logger.info(`Generando test para estudiante ${student.name} (ID: ${studentId})`);
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
  
  let pdfPath = null;
  
  // Try to generate PDF, but if it fails, continue without it
  try {
    if (process.env.ENABLE_PDF_GENERATION === 'true') {
      logger.info(`Generando PDF para test ID: ${test.id}`);
      const pdfResult = await generatePDF(content, {
        title: test.title,
        studentName: student.name,
        language: options.language,
        level: options.level
      });
      pdfPath = pdfResult.path;
    }
  } catch (error) {
    logger.warn('Error al generar PDF, continuando sin PDF:', error);
    // Continue without PDF
  }
  
  // Send email (with or without PDF attachment)
  logger.info(`Enviando test a ${student.email}`);
  await sendTestByEmail(student, test, pdfPath);
  
  // Delete the temporary file if it exists
  if (pdfPath && fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }
  
  // Update test status
  await test.update({
    status: 'sent',
    sentAt: new Date()
  });
  
  return { test };
};

module.exports = {
  sendTest,
  generateAndSendTest
};

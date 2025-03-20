
const Test = require('../models/Test');
const Student = require('../models/Student');
const { generateOpenAITest } = require('../services/openai.service');
const { generatePDF } = require('../services/pdf.service');
const { sendTestByEmail } = require('../services/email.service');
const fs = require('fs');
const path = require('path');

// Obtener todos los tests del usuario autenticado
const getAllTests = async (req, res) => {
  try {
    // Buscar estudiantes del usuario para obtener sus IDs
    const students = await Student.findAll({
      where: { userId: req.user.id },
      attributes: ['id']
    });
    
    const studentIds = students.map(student => student.id);
    
    // Buscar tests asociados a esos estudiantes
    const tests = await Test.findAll({
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
    
    res.json(tests);
  } catch (error) {
    req.logger.error('Error al obtener tests:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un test por ID
const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'language', 'level']
        }
      ]
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test no encontrado' });
    }
    
    // Verificar que el test pertenece a un estudiante del usuario
    const student = await Student.findByPk(test.studentId);
    if (!student || student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    res.json(test);
  } catch (error) {
    req.logger.error('Error al obtener test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear un nuevo test manualmente
const createTest = async (req, res) => {
  try {
    const { studentId, title, language, level, content } = req.body;
    
    // Verificar que el estudiante pertenece al usuario
    const student = await Student.findByPk(studentId);
    if (!student || student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para crear test para este estudiante' });
    }
    
    const test = await Test.create({
      studentId,
      title,
      language,
      level,
      content,
      status: 'draft'
    });
    
    res.status(201).json(test);
  } catch (error) {
    req.logger.error('Error al crear test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generar un test con OpenAI
const generateTest = async (req, res) => {
  try {
    const { studentId, options } = req.body;
    
    // Verificar que el estudiante pertenece al usuario
    const student = await Student.findByPk(studentId);
    if (!student || student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para generar test para este estudiante' });
    }
    
    // Añadir el nombre del estudiante a las opciones
    const testOptions = {
      ...options,
      studentName: student.name
    };
    
    // Generar contenido con OpenAI
    const content = await generateOpenAITest(testOptions);
    
    // Crear el nuevo test
    const test = await Test.create({
      studentId,
      title: `${options.language} Test - Level ${options.level}`,
      language: options.language,
      level: options.level,
      content,
      status: 'draft'
    });
    
    res.status(201).json(test);
  } catch (error) {
    req.logger.error('Error al generar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Enviar un test por email
const sendTest = async (req, res) => {
  try {
    const { testId } = req.body;
    
    // Buscar el test
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
      return res.status(404).json({ message: 'Test no encontrado' });
    }
    
    // Verificar que el test pertenece a un estudiante del usuario
    if (test.student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Generar PDF del test
    const pdfResult = await generatePDF(test.content, {
      title: test.title,
      studentName: test.student.name,
      language: test.language,
      level: test.level
    });
    
    // Enviar email con el PDF adjunto
    await sendTestByEmail(test.student, test, pdfResult.path);
    
    // Eliminar el archivo temporal después de enviarlo
    fs.unlinkSync(pdfResult.path);
    
    // Actualizar estado del test
    await test.update({
      status: 'sent',
      sentAt: new Date()
    });
    
    res.json({ 
      message: 'Test enviado correctamente',
      test
    });
  } catch (error) {
    req.logger.error('Error al enviar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Generar y enviar test en un solo paso
const generateAndSendTest = async (req, res) => {
  try {
    const { studentId, options } = req.body;
    
    // Verificar que el estudiante pertenece al usuario
    const student = await Student.findByPk(studentId);
    if (!student || student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para generar test para este estudiante' });
    }
    
    // Añadir el nombre del estudiante a las opciones
    const testOptions = {
      ...options,
      studentName: student.name
    };
    
    // Generar contenido con OpenAI
    req.logger.info(`Generando test para estudiante ${student.name} (ID: ${studentId})`);
    const content = await generateOpenAITest(testOptions);
    
    // Crear el nuevo test
    const test = await Test.create({
      studentId,
      title: `${options.language} Test - Level ${options.level}`,
      language: options.language,
      level: options.level,
      content,
      status: 'draft'
    });
    
    // Generar PDF del test
    req.logger.info(`Generando PDF para test ID: ${test.id}`);
    const pdfResult = await generatePDF(content, {
      title: test.title,
      studentName: student.name,
      language: options.language,
      level: options.level
    });
    
    // Enviar email con el PDF adjunto
    req.logger.info(`Enviando test a ${student.email}`);
    await sendTestByEmail(student, test, pdfResult.path);
    
    // Eliminar el archivo temporal después de enviarlo
    fs.unlinkSync(pdfResult.path);
    
    // Actualizar estado del test
    await test.update({
      status: 'sent',
      sentAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Test generado y enviado correctamente',
      test
    });
  } catch (error) {
    req.logger.error('Error al generar y enviar test:', error);
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Actualizar un test
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Buscar el test
    const test = await Test.findByPk(id, {
      include: [{
        model: Student,
        as: 'student',
        attributes: ['userId']
      }]
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test no encontrado' });
    }
    
    // Verificar que el test pertenece a un estudiante del usuario
    if (test.student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Actualizar test
    await test.update({
      title: title || test.title,
      content: content || test.content
    });
    
    res.json(test);
  } catch (error) {
    req.logger.error('Error al actualizar test:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un test
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el test
    const test = await Test.findByPk(id, {
      include: [{
        model: Student,
        as: 'student',
        attributes: ['userId']
      }]
    });
    
    if (!test) {
      return res.status(404).json({ message: 'Test no encontrado' });
    }
    
    // Verificar que el test pertenece a un estudiante del usuario
    if (test.student.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Eliminar test
    await test.destroy();
    
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


const Student = require('../models/Student');
const User = require('../models/User');
const { Op } = require('sequelize');
const { sendLessonTopicEmail } = require('./email.service');

// Actualizar el tema de la próxima clase para un estudiante
const updateStudentLessonTopic = async (studentId, userId, topic) => {
  // Verificar que el estudiante pertenece al usuario
  const student = await Student.findOne({
    where: {
      id: studentId,
      userId,
    },
  });

  if (!student) {
    return { error: 'Estudiante no encontrado o no autorizado', statusCode: 404 };
  }

  // Actualizar el tema
  await student.update({ nextLessonTopic: topic });

  return { success: true, message: 'Tema actualizado correctamente' };
};

// Obtener el tema de la próxima clase para un estudiante
const getStudentLessonTopic = async (studentId, userId) => {
  const student = await Student.findOne({
    where: {
      id: studentId,
      userId,
    },
  });

  if (!student) {
    return { error: 'Estudiante no encontrado o no autorizado', statusCode: 404 };
  }

  return { nextLessonTopic: student.nextLessonTopic };
};

// Enviar emails con los temas de la próxima clase
const sendWeeklyLessonTopics = async (logger) => {
  try {
    // Obtener todos los estudiantes con temas definidos
    const students = await Student.findAll({
      where: {
        nextLessonTopic: {
          [Op.not]: null,
          [Op.ne]: '',
        },
      },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['name', 'email'],
        },
      ],
    });

    logger.info(`Encontrados ${students.length} estudiantes con temas para enviar`);

    // Enviar email a cada estudiante
    let successCount = 0;
    for (const student of students) {
      try {
        await sendLessonTopicEmail(student, student.teacher);
        successCount++;
      } catch (error) {
        logger.error(`Error al enviar email a ${student.email}: ${error.message}`);
      }
    }

    logger.info(`Se han enviado ${successCount} emails de temas de clase correctamente`);
    
    return { success: true, count: successCount };
  } catch (error) {
    logger.error(`Error al enviar emails de temas: ${error.message}`);
    return { error: 'Error al enviar emails', details: error.message };
  }
};

// Limpiar todos los temas después del envío
const clearAllLessonTopics = async (logger) => {
  try {
    const result = await Student.update(
      { nextLessonTopic: null },
      { where: { nextLessonTopic: { [Op.not]: null } } }
    );

    logger.info(`Se han limpiado los temas de ${result[0]} estudiantes`);
    
    return { success: true, count: result[0] };
  } catch (error) {
    logger.error(`Error al limpiar temas: ${error.message}`);
    return { error: 'Error al limpiar temas', details: error.message };
  }
};

module.exports = {
  updateStudentLessonTopic,
  getStudentLessonTopic,
  sendWeeklyLessonTopics,
  clearAllLessonTopics,
};

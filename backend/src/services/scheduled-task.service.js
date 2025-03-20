
const ScheduledTask = require('../models/ScheduledTask');
const Student = require('../models/Student');
const Test = require('../models/Test');
const User = require('../models/User');
const { Op } = require('sequelize');
const { sendTestByEmail } = require('./email.service');
const { sendLessonTopicEmail } = require('./email.service');
const { generatePDF } = require('./pdf.service');
const fs = require('fs');

// Create a scheduled task
const createScheduledTask = async (taskData, userId) => {
  try {
    // Validate the request data
    if (!taskData.taskType || !taskData.scheduledFor) {
      return { error: 'Faltan datos requeridos', statusCode: 400 };
    }

    // Create the task
    const task = await ScheduledTask.create({
      ...taskData,
      userId,
      status: 'pending',
    });

    return { task };
  } catch (error) {
    console.error('Error creating scheduled task:', error);
    return { error: 'Error al crear la tarea programada', statusCode: 500 };
  }
};

// Get scheduled tasks for a user
const getUserScheduledTasks = async (userId) => {
  try {
    const tasks = await ScheduledTask.findAll({
      where: { userId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'language', 'level'],
        },
        {
          model: Test,
          as: 'test',
          attributes: ['id', 'title', 'language', 'level', 'content'],
        },
      ],
      order: [['scheduledFor', 'ASC']],
    });

    return { tasks };
  } catch (error) {
    console.error('Error getting scheduled tasks:', error);
    return { error: 'Error al obtener las tareas programadas', statusCode: 500 };
  }
};

// Cancel a scheduled task
const cancelScheduledTask = async (taskId, userId) => {
  try {
    const task = await ScheduledTask.findOne({
      where: {
        id: taskId,
        userId,
        status: 'pending',
      },
    });

    if (!task) {
      return { error: 'Tarea no encontrada o no se puede cancelar', statusCode: 404 };
    }

    await task.destroy();
    return { success: true, message: 'Tarea cancelada correctamente' };
  } catch (error) {
    console.error('Error canceling scheduled task:', error);
    return { error: 'Error al cancelar la tarea programada', statusCode: 500 };
  }
};

// Process pending tasks that are due
const processScheduledTasks = async (logger) => {
  try {
    // Find tasks that are due
    const dueTasks = await ScheduledTask.findAll({
      where: {
        status: 'pending',
        scheduledFor: {
          [Op.lte]: new Date(),
        },
      },
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: Test,
          as: 'test',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    logger.info(`Processing ${dueTasks.length} scheduled tasks`);

    for (const task of dueTasks) {
      try {
        if (task.taskType === 'test' && task.test) {
          await processTestTask(task, logger);
        } else if (task.taskType === 'lesson_topic' && task.student) {
          await processLessonTopicTask(task, logger);
        } else {
          logger.warn(`Invalid task type or missing data for task ID: ${task.id}`);
          await task.update({ status: 'failed' });
          continue;
        }

        await task.update({ status: 'completed' });
        logger.info(`Task ID: ${task.id} completed successfully`);
      } catch (error) {
        logger.error(`Error processing task ID: ${task.id}:`, error);
        await task.update({ status: 'failed' });
      }
    }

    return { processed: dueTasks.length };
  } catch (error) {
    logger.error('Error processing scheduled tasks:', error);
    return { error: 'Error al procesar tareas programadas', details: error.message };
  }
};

// Helper to process a test email task
const processTestTask = async (task, logger) => {
  const { test, student } = task;
  
  if (!test || !student) {
    throw new Error('Missing test or student data');
  }

  logger.info(`Sending scheduled test: ${test.title} to ${student.email}`);
  
  let pdfPath = null;
  
  // Try to generate PDF if enabled
  try {
    if (process.env.ENABLE_PDF_GENERATION === 'true') {
      const pdfResult = await generatePDF(test.content, {
        title: test.title,
        studentName: student.name,
        language: test.language,
        level: test.level
      });
      pdfPath = pdfResult.path;
    }
  } catch (error) {
    logger.warn('Error generating PDF, continuing without it:', error);
  }
  
  // Send email
  await sendTestByEmail(student, test, pdfPath);
  
  // Clean up PDF file if it exists
  if (pdfPath && fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }
  
  // Update test status if needed
  if (test.status !== 'sent') {
    await test.update({
      status: 'sent',
      sentAt: new Date()
    });
  }
};

// Helper to process a lesson topic email task
const processLessonTopicTask = async (task, logger) => {
  const { student } = task;
  
  if (!student || !student.nextLessonTopic) {
    throw new Error('Missing student data or lesson topic');
  }

  logger.info(`Sending scheduled lesson topic to ${student.email}`);
  
  // Send email with lesson topic
  await sendLessonTopicEmail(student, student.teacher);
};

module.exports = {
  createScheduledTask,
  getUserScheduledTasks,
  cancelScheduledTask,
  processScheduledTasks,
};

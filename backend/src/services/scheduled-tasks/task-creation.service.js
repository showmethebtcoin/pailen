
const ScheduledTask = require('../../models/ScheduledTask');

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

module.exports = {
  createScheduledTask,
};

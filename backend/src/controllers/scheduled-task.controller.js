
const scheduledTaskService = require('../services/scheduled-task.service');

// Create a new scheduled task
const createScheduledTask = async (req, res) => {
  try {
    const { task, error, statusCode } = await scheduledTaskService.createScheduledTask(
      req.body,
      req.user.id
    );

    if (error) {
      return res.status(statusCode || 500).json({ error });
    }

    return res.status(201).json({ task });
  } catch (error) {
    req.logger.error('Error creating scheduled task:', error);
    return res.status(500).json({ error: 'Error al crear la tarea programada' });
  }
};

// Get all scheduled tasks for the current user
const getUserScheduledTasks = async (req, res) => {
  try {
    const { tasks, error, statusCode } = await scheduledTaskService.getUserScheduledTasks(
      req.user.id
    );

    if (error) {
      return res.status(statusCode || 500).json({ error });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    req.logger.error('Error getting scheduled tasks:', error);
    return res.status(500).json({ error: 'Error al obtener las tareas programadas' });
  }
};

// Cancel a scheduled task
const cancelScheduledTask = async (req, res) => {
  try {
    const { success, message, error, statusCode } = await scheduledTaskService.cancelScheduledTask(
      req.params.id,
      req.user.id
    );

    if (error) {
      return res.status(statusCode || 500).json({ error });
    }

    return res.status(200).json({ success, message });
  } catch (error) {
    req.logger.error('Error canceling scheduled task:', error);
    return res.status(500).json({ error: 'Error al cancelar la tarea programada' });
  }
};

module.exports = {
  createScheduledTask,
  getUserScheduledTasks,
  cancelScheduledTask,
};

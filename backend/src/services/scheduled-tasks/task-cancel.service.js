
const ScheduledTask = require('../../models/ScheduledTask');

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

module.exports = {
  cancelScheduledTask,
};

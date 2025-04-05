
const ScheduledTask = require('../../models/ScheduledTask');
const Student = require('../../models/Student');
const Test = require('../../models/Test');

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

module.exports = {
  getUserScheduledTasks,
};

const { LessonTopicsHistory } = require('../models');

const getLessonTopicsHistory = async (req, res) => {
  const { studentId } = req.params;

  try {
    const topics = await LessonTopicsHistory.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']],
    });

    res.json(topics);
  } catch (error) {
    console.error('Error al obtener el historial de temas:', error);
    res.status(500).json({ error: 'Error al obtener el historial de temas' });
  }
};

module.exports = {
  getLessonTopicsHistory,
};

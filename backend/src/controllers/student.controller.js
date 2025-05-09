const Student = require('../models/Student');
const { LessonTopicsHistory } = require('../models');
const lessonTopicService = require('../services/lesson-topic.service');

// Obtener todos los estudiantes del usuario autenticado
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    
    res.json(students);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un estudiante por ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear un nuevo estudiante
const createStudent = async (req, res) => {
  try {
    const { name, email, language, level, hoursPerWeek, startDate } = req.body;
    
    const student = await Student.create({
      name,
      email,
      language,
      level,
      hoursPerWeek: parseFloat(hoursPerWeek) || 1,
      startDate,
      userId: req.user.id,
    });
    
    res.status(201).json(student);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar un estudiante existente
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, language, level, hoursPerWeek, startDate, nextLessonTopic } = req.body;
    
    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const previousTopic = student.nextLessonTopic;

    student.name = name ?? student.name;
    student.email = email ?? student.email;
    student.language = language ?? student.language;
    student.level = level ?? student.level;
    student.hoursPerWeek = parseFloat(hoursPerWeek) || student.hoursPerWeek;
    student.startDate = startDate || student.startDate;
    student.nextLessonTopic = nextLessonTopic ?? student.nextLessonTopic;

    await student.save();

    if (nextLessonTopic && nextLessonTopic !== previousTopic) {
      await LessonTopicsHistory.create({
        studentId: student.id,
        topic: nextLessonTopic,
        date: new Date(),
      });
    }

    res.json(student);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    await student.destroy();

    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar el tema de la próxima clase para un estudiante
const updateStudentLessonTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { topic } = req.body;

    const result = await lessonTopicService.updateStudentLessonTopic(id, req.user.id, topic);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al actualizar tema de clase:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener el tema de la próxima clase para un estudiante
const getStudentLessonTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await lessonTopicService.getStudentLessonTopic(id, req.user.id);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener tema de clase:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  updateStudentLessonTopic,
  getStudentLessonTopic,
};

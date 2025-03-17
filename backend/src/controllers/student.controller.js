
const Student = require('../models/Student');

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
    
    // Crear estudiante asociado al usuario autenticado
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
    const { name, email, language, level, hoursPerWeek, startDate } = req.body;
    
    // Buscar el estudiante
    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    // Actualizar datos
    const updatedStudent = await student.update({
      name,
      email,
      language,
      level,
      hoursPerWeek: parseFloat(hoursPerWeek) || student.hoursPerWeek,
      startDate: startDate || student.startDate,
    });
    
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un estudiante
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el estudiante
    const student = await Student.findOne({
      where: {
        id,
        userId: req.user.id,
      },
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    // Eliminar estudiante
    await student.destroy();
    
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

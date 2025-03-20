
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyToken } = require('../config/jwt');

// Registro de nuevo usuario
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generar tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Devolver respuesta sin incluir la contraseña
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar tokens JWT
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Devolver respuesta
    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener información del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Refrescar token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'No se proporcionó token de refresco' });
    }
    
    // Verificar el token de refresco
    const decoded = verifyToken(refreshToken);
    
    // Verificar que sea un token de refresco
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    // Generar nuevo token de acceso
    const newToken = generateToken(user.id);
    
    // Devolver respuesta
    res.json({
      token: newToken,
    });
  } catch (error) {
    console.error('Error al refrescar token:', error);
    res.status(401).json({ message: 'Token de refresco inválido o expirado' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
};

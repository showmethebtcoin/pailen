
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const authenticate = async (req, res, next) => {
  try {
    // Verificar header de autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    // Obtener token
    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Agregar usuario al objeto de solicitud
    req.user = user;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { authenticate };

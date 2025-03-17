
const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token válido por 7 días
  });
};

module.exports = { generateToken };

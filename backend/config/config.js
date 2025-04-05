require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'language_app',
    host: 'db', // ← ¡IMPORTANTE! Este debe coincidir con el nombre del servicio en docker-compose
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'language_app',
    host: 'db',
    dialect: 'postgres',
  },
};

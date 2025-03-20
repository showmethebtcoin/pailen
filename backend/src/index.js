
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const testRoutes = require('./routes/test.routes');
const stripeRoutes = require('./routes/stripe.routes');
const scheduledTaskRoutes = require('./routes/scheduled-task.routes');
const { startScheduledTasks } = require('./services/scheduler.service');
const { startQueueProcessor } = require('./utils/redis');

// Configuración de Winston para logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'language-app-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Si no estamos en producción, también log a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Middleware de seguridad con Helmet
app.use(helmet());

// Aplicar rate limit a todas las solicitudes
app.use(limiter);

// Middleware para logging de errores
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/scheduled-tasks', scheduledTaskRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Language App' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).json({ 
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Iniciar servidor y conectar a la base de datos
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados con la base de datos.');
    
    // Iniciar tareas programadas
    startScheduledTasks();
    console.log('Tareas programadas iniciadas correctamente.');
    
    // Iniciar procesador de cola
    startQueueProcessor();
    console.log('Procesador de cola iniciado correctamente.');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    logger.error('Error al iniciar el servidor:', error);
  }
}

startServer();

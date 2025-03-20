
const cron = require('node-cron');
const winston = require('winston');
const { sendWeeklyLessonTopics, clearAllLessonTopics } = require('./lesson-topic.service');
const { processScheduledTasks } = require('./scheduled-task.service');

// Configuración de Winston para logs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'scheduler-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/scheduler-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/scheduler.log' }),
  ],
});

// Si no estamos en producción, también log a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Iniciar tareas programadas
const startScheduledTasks = () => {
  logger.info('Iniciando tareas programadas');
  
  // Enviar emails con temas de clase (domingo a las 12:00)
  cron.schedule('0 12 * * 0', async () => {
    logger.info('Ejecutando tarea de envío de temas de clase');
    try {
      const result = await sendWeeklyLessonTopics(logger);
      logger.info(`Resultado de envío de temas: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`Error en tarea programada de envío de temas: ${error.message}`);
    }
  });
  
  // Limpiar temas una hora después (domingo a las 13:00)
  cron.schedule('0 13 * * 0', async () => {
    logger.info('Ejecutando tarea de limpieza de temas de clase');
    try {
      const result = await clearAllLessonTopics(logger);
      logger.info(`Resultado de limpieza de temas: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`Error en tarea programada de limpieza de temas: ${error.message}`);
    }
  });
  
  // Revisar tareas programadas por los usuarios cada minuto
  cron.schedule('* * * * *', async () => {
    logger.info('Verificando tareas programadas pendientes');
    try {
      const result = await processScheduledTasks(logger);
      if (result.processed > 0) {
        logger.info(`Se procesaron ${result.processed} tareas programadas`);
      }
    } catch (error) {
      logger.error(`Error al procesar tareas programadas: ${error.message}`);
    }
  });
  
  logger.info('Tareas programadas inicializadas correctamente');
};

module.exports = {
  startScheduledTasks
};

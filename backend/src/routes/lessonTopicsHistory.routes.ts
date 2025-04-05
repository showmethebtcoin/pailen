import { Router } from 'express';
import { getLessonTopicsHistory } from '../controllers/lessonTopicsHistoryController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Ruta protegida para obtener el historial de temas por estudiante
router.get('/:studentId', authenticateToken, getLessonTopicsHistory);

module.exports = router;


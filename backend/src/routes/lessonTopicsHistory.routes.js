const express = require('express');
const router = express.Router();
const { getLessonTopicsHistory } = require('../controllers/lessonTopicsHistoryController');
const { authenticate } = require('../middleware/auth');

router.get('/:studentId', authenticate, getLessonTopicsHistory);

module.exports = router;

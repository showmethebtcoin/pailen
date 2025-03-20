
const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  createScheduledTask,
  getUserScheduledTasks,
  cancelScheduledTask,
} = require('../controllers/scheduled-task.controller');

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

// Routes for scheduled tasks
router.post('/', createScheduledTask);
router.get('/', getUserScheduledTasks);
router.delete('/:id', cancelScheduledTask);

module.exports = router;

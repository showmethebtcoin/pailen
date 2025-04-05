const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LessonTopicsHistory = sequelize.define('LessonTopicsHistory', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'lesson_topics_history',
  timestamps: true,
});

module.exports = LessonTopicsHistory;

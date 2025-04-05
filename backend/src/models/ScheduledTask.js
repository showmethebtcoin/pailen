
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Test = require('./Test');

const ScheduledTask = sequelize.define(
  'ScheduledTask',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    taskType: {
      type: DataTypes.ENUM('test', 'lesson_topic'),
      allowNull: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Students',
        key: 'id',
      },
    },
    testId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tests',
        key: 'id',
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Relations
ScheduledTask.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

ScheduledTask.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});

ScheduledTask.belongsTo(Test, {
  foreignKey: 'testId',
  as: 'test',
});

module.exports = ScheduledTask;

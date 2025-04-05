'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonTopicsHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LessonTopicsHistory.init({
    studentId: DataTypes.INTEGER,
    topic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LessonTopicsHistory',
  });
  return LessonTopicsHistory;
};
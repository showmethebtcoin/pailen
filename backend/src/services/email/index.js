
const testEmailService = require('./test-email.service');
const lessonTopicEmailService = require('./lesson-topic-email.service');
const emailConfigService = require('./email-config.service');

module.exports = {
  sendTestByEmail: testEmailService.sendTestByEmail,
  sendLessonTopicEmail: lessonTopicEmailService.sendLessonTopicEmail,
  configureEmailService: emailConfigService.configureEmailService
};

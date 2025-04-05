
const sgMail = require('@sendgrid/mail');

// Configure SendGrid with the API key
const configureEmailService = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

// Initialize the email service
configureEmailService();

module.exports = {
  configureEmailService
};

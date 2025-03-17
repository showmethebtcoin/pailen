
const sgMail = require('@sendgrid/mail');

// Configurar SendGrid con la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Enviar test por email
const sendTestByEmail = async (student, test) => {
  const msg = {
    to: student.email,
    from: process.env.EMAIL_FROM || 'noreply@languageapp.com',
    subject: `${test.title} - Language Test`,
    text: `Hola ${student.name},

Aquí tienes tu test de ${test.language} de nivel ${test.level}.

${test.content}

Buena suerte!

Saludos,
Tu profesor de idiomas`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hola ${student.name},</h2>
        <p>Aquí tienes tu test de <strong>${test.language}</strong> de nivel <strong>${test.level}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <pre style="white-space: pre-wrap; font-family: inherit;">${test.content}</pre>
        </div>
        
        <p>¡Buena suerte!</p>
        
        <p>Saludos,<br>Tu profesor de idiomas</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('No se pudo enviar el email. Inténtalo de nuevo más tarde.');
  }
};

module.exports = {
  sendTestByEmail
};

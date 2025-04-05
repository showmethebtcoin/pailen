
const sgMail = require('@sendgrid/mail');
const fs = require('fs');

// Send test by email
const sendTestByEmail = async (student, test, pdfPath) => {
  const msg = {
    to: student.email,
    from: {
      email: process.env.EMAIL_FROM || 'noreply@languageapp.com',
      name: process.env.EMAIL_NAME || 'Language Teacher'
    },
    subject: `Tu nuevo test de ${test.language} - Nivel ${test.level}`,
    text: `Hola ${student.name},

Aquí tienes tu test de ${test.language} de nivel ${test.level}.

${test.content}

${pdfPath ? 'Adjunto encontrarás una versión en PDF del test.' : ''}

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
        
        ${pdfPath ? '<p>Adjunto encontrarás una versión en PDF del test.</p>' : ''}
        
        <p>¡Buena suerte!</p>
        
        <p>Saludos,<br>Tu profesor de idiomas</p>
      </div>
    `
  };
  
  // Add attachment if it exists
  if (pdfPath && fs.existsSync(pdfPath)) {
    try {
      const attachment = fs.readFileSync(pdfPath).toString('base64');
      
      msg.attachments = [
        {
          content: attachment,
          filename: `Test_${test.language}_${test.level}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ];
    } catch (error) {
      console.warn('No se pudo adjuntar el PDF, continuando sin adjunto:', error.message);
      // Continue without attachment
    }
  }
  
  try {
    await sgMail.send(msg);
    return {
      success: true,
      message: `Email enviado exitosamente a ${student.email}`
    };
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('No se pudo enviar el email. Inténtalo de nuevo más tarde.');
  }
};

module.exports = {
  sendTestByEmail
};

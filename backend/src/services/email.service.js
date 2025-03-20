const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const { Op } = require('sequelize');

// Configurar SendGrid con la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Enviar test por email
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
  
  // Añadir archivo adjunto si existe
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
      // Continuar sin el archivo adjunto
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

// Enviar email con el tema de la próxima clase
const sendLessonTopicEmail = async (student, teacher) => {
  if (!student.nextLessonTopic) {
    return { success: false, message: 'No hay tema definido para este estudiante' };
  }

  const msg = {
    to: student.email,
    from: {
      email: process.env.EMAIL_FROM || 'noreply@languageapp.com',
      name: teacher?.name || process.env.EMAIL_NAME || 'Language Teacher'
    },
    subject: `Tema para tu próxima clase de ${student.language}`,
    text: `Hola ${student.name},

En tu próxima clase de ${student.language} trabajaremos sobre el siguiente tema:

${student.nextLessonTopic}

¡Nos vemos en clase!

Saludos,
${teacher?.name || 'Tu profesor de idiomas'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hola ${student.name},</h2>
        <p>En tu próxima clase de <strong>${student.language}</strong> trabajaremos sobre el siguiente tema:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="font-size: 16px;">${student.nextLessonTopic}</p>
        </div>
        
        <p>¡Nos vemos en clase!</p>
        
        <p>Saludos,<br>${teacher?.name || 'Tu profesor de idiomas'}</p>
      </div>
    `
  };
  
  try {
    await sgMail.send(msg);
    return {
      success: true,
      message: `Email con tema de clase enviado exitosamente a ${student.email}`
    };
  } catch (error) {
    console.error('Error al enviar email con tema de clase:', error);
    throw new Error('No se pudo enviar el email con el tema de clase. Inténtalo de nuevo más tarde.');
  }
};

module.exports = {
  sendTestByEmail,
  sendLessonTopicEmail
};

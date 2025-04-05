
const sgMail = require('@sendgrid/mail');

// Send email with the next lesson topic
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
  sendLessonTopicEmail
};

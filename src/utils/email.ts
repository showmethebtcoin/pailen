
import { Test, Student } from '@/types/student';
import axios from 'axios';

export const sendTestEmail = async (student: Student, test: Test): Promise<boolean> => {
  try {
    const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    const emailFrom = import.meta.env.VITE_EMAIL_FROM || 'noreply@languageapp.com';
    
    if (!apiKey) {
      console.warn('No SendGrid API key found, using mock email sending');
      // Mock successful email sending
      return mockSendEmail(student, test);
    }
    
    console.log(`Sending test "${test.title}" to ${student.email} with SendGrid`);
    
    // Preparar el email
    const emailData = {
      personalizations: [
        {
          to: [{ email: student.email, name: student.name }],
          subject: `${test.title} - Language Test`
        }
      ],
      from: { email: emailFrom, name: "Language Teacher" },
      content: [
        {
          type: "text/html",
          value: `
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
        }
      ]
    };
    
    // Enviar con SendGrid
    await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Email sent successfully to ${student.email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const mockSendEmail = (student: Student, test: Test): Promise<boolean> => {
  // Simular envío exitoso de email
  console.log(`[MOCK] Sending test "${test.title}" to ${student.email}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[MOCK] Email sent successfully to ${student.email}`);
      resolve(true);
    }, 1000);
  });
};

export const scheduleWeeklyTests = async (students: Student[]): Promise<number> => {
  // En una implementación real, esto programaría emails usando SendGrid API
  console.log(`Scheduling weekly tests for ${students.length} students`);
  
  // Mock scheduling
  return students.length;
};


/**
 * Creates HTML content for a test PDF
 * @param {string} testContent - The content of the test
 * @param {Object} options - Configuration options
 * @returns {string} HTML content
 */
const createTestHtml = (testContent, options = {}) => {
  const { title, studentName, language = 'unknown', level = 'unknown' } = options;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || `Test de ${language}`}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          line-height: 1.6;
        }
        h1 {
          color: #333;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        .header {
          margin-bottom: 30px;
        }
        .student-info {
          margin-bottom: 20px;
          font-style: italic;
          color: #555;
        }
        .question {
          margin-bottom: 15px;
        }
        .answer-key {
          margin-top: 30px;
          border-top: 1px solid #ddd;
          padding-top: 15px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 0.8em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title || `Test de ${language} - Nivel ${level}`}</h1>
        <div class="student-info">
          ${studentName ? `Preparado para: ${studentName}` : ''}
          <br>
          Fecha: ${new Date().toLocaleDateString()}
        </div>
      </div>
      <div class="content">
        ${testContent.replace(/\n/g, '<br>').replace(/##/g, '<strong>').replace(/\*/g, '</strong>')}
      </div>
      <div class="footer">
        <p>Este test ha sido generado automáticamente para ayudarte en tu aprendizaje.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  createTestHtml
};

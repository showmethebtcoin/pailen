
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Generar PDF a partir del contenido del test
const generatePDF = async (testContent, options = {}) => {
  const { title, studentName, language, level } = options;
  
  // Crear directorio temporal si no existe
  const tempDir = path.join(os.tmpdir(), 'language-app-tests');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Generar nombre de archivo único
  const timestamp = new Date().getTime();
  const filename = `test_${language}_${level}_${timestamp}.pdf`;
  const outputPath = path.join(tempDir, filename);
  
  // Crear contenido HTML para el PDF
  const htmlContent = `
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
  
  // Lanzar Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necesario para entornos Docker
  });
  
  try {
    const page = await browser.newPage();
    
    // Establecer contenido HTML
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generar PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return {
      path: outputPath,
      filename: filename
    };
  } finally {
    await browser.close();
  }
};

module.exports = {
  generatePDF
};

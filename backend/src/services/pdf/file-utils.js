
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Sets up the output directory and filename for PDF generation
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing tempDir, outputPath and filename
 */
const setupOutputPath = (options = {}) => {
  const { language = 'unknown', level = 'unknown' } = options;
  
  // Create temporary directory if it doesn't exist
  const tempDir = path.join(os.tmpdir(), 'language-app-tests');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Generate unique filename
  const timestamp = new Date().getTime();
  const filename = `test_${language}_${level}_${timestamp}.pdf`;
  const outputPath = path.join(tempDir, filename);
  
  return {
    tempDir,
    outputPath,
    filename
  };
};

module.exports = {
  setupOutputPath
};

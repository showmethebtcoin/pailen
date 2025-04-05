
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const htmlGenerator = require('./pdf/html-generator');
const fileUtils = require('./pdf/file-utils');

/**
 * Generates a PDF document from test content
 * @param {string} testContent - The content of the test
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Object containing path and filename
 */
const generatePDF = async (testContent, options = {}) => {
  // Create temp directory and generate unique filename
  const { tempDir, outputPath, filename } = fileUtils.setupOutputPath(options);
  
  // Generate HTML content for the PDF
  const htmlContent = htmlGenerator.createTestHtml(testContent, options);
  
  // Generate PDF using Puppeteer
  const result = await renderPdfFromHtml(htmlContent, outputPath);
  
  return {
    path: outputPath,
    filename: filename
  };
};

/**
 * Renders a PDF from HTML content using Puppeteer
 * @param {string} htmlContent - The HTML content to render
 * @param {string} outputPath - Where to save the PDF
 * @returns {Promise<void>}
 */
const renderPdfFromHtml = async (htmlContent, outputPath) => {
  // Launch Puppeteer with proper configuration for Docker environment
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // Set HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
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
    
  } finally {
    await browser.close();
  }
};

module.exports = {
  generatePDF
};

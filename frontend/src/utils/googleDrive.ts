
import axios from 'axios';
import { Test } from '@/types/student';

// Interfaz para los tests guardados
interface SavedTest {
  id: string;
  name: string;
  fileId: string;
  webViewLink: string;
  downloadLink: string;
}

// Función para guardar un test en Google Drive
export const saveTestToDrive = async (test: Test): Promise<SavedTest | null> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
    const folderIdDefault = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
    
    if (!apiKey) {
      console.warn('No Google Drive API key found, skipping Drive upload');
      return null;
    }
    
    // Crear el contenido del archivo (podría ser HTML para mejor formato)
    const fileContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${test.title}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          pre { white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>${test.title}</h1>
        <p>Language: ${test.language}</p>
        <p>Level: ${test.level}</p>
        <pre>${test.content}</pre>
      </body>
      </html>
    `;
    
    // Convertir a blob para subir
    const blob = new Blob([fileContent], { type: 'text/html' });
    
    // Nombre del archivo
    const fileName = `${test.language}_Test_${test.level}_${new Date().toISOString().split('T')[0]}.html`;
    
    // Crear FormData para la subida
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify({
      name: fileName,
      mimeType: 'text/html',
      parents: [folderIdDefault || 'root']
    })], { type: 'application/json' }));
    formData.append('file', blob);
    
    // Usar la API de Google Drive para subir el archivo
    console.log('Uploading test to Google Drive...');
    
    // Intentar usar el backend como proxy para autenticación
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || '/api'}/tests/upload-to-drive`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    if (response.data && response.data.fileId) {
      console.log('Test uploaded to Google Drive', response.data);
      return {
        id: response.data.id,
        name: fileName,
        fileId: response.data.fileId,
        webViewLink: response.data.webViewLink,
        downloadLink: response.data.webContentLink
      };
    }
    
    throw new Error('Failed to upload to Drive - invalid response');
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return null;
  }
};

// Función para obtener un test de Google Drive por ID
export const getTestFromDrive = async (fileId: string): Promise<Blob | null> => {
  try {
    // Usar el backend como proxy para autenticación
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL || '/api'}/tests/download-from-drive/${fileId}`,
      {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error downloading from Google Drive:', error);
    return null;
  }
};

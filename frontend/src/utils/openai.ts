
import { TestGenerationOptions } from '@/types/student';
import axios from 'axios';

export const generateTest = async (options: TestGenerationOptions): Promise<string> => {
  const { language, level, questionCount = 10, includeAnswers = true } = options;
  
  try {
    // Verificar si hay una API key de OpenAI en las variables de entorno
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('No OpenAI API key found, using mock response');
      return generateMockTest(options);
    }
    
    console.log('Generating test with OpenAI API, options:', options);
    
    // Construir el prompt para OpenAI
    const prompt = `Crea un test de idioma ${language} para estudiantes de nivel ${level}. 
      El test debe incluir ${questionCount} preguntas.
      Las preguntas deben ser variadas e incluir gramática, vocabulario y comprensión.
      ${includeAnswers ? 'Incluye las respuestas correctas al final del test.' : 'No incluyas las respuestas.'}
      Formatea el test de manera clara y profesional.`;
    
    // Llamar a la API de OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un profesor de idiomas profesional creando tests para tus estudiantes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    console.log('Falling back to mock response');
    return generateMockTest(options);
  }
};

// Función para generar un test de ejemplo cuando no se puede llamar a la API
const generateMockTest = (options: TestGenerationOptions): string => {
  const { language, level, questionCount = 10 } = options;
  
  const topics = language === 'English' 
    ? ['greetings', 'travel', 'food', 'hobbies', 'weather'] 
    : ['saludos', 'viajes', 'comida', 'pasatiempos', 'clima'];
  
  let testContent = `# ${language} Test - Level ${level}\n\n`;
  
  for (let i = 1; i <= questionCount; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    testContent += `## Question ${i}\n`;
    
    if (language === 'English') {
      testContent += `Choose the correct option for the following ${topic} situation:\n\n`;
      testContent += `a) Option 1\nb) Option 2\nc) Option 3\nd) Option 4\n\n`;
    } else {
      testContent += `Elige la opción correcta para la siguiente situación de ${topic}:\n\n`;
      testContent += `a) Opción 1\nb) Opción 2\nc) Opción 3\nd) Opción 4\n\n`;
    }
  }
  
  if (options.includeAnswers) {
    testContent += `\n# Answer Key\n`;
    for (let i = 1; i <= questionCount; i++) {
      const randomAnswer = ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
      testContent += `${i}. ${randomAnswer}\n`;
    }
  }
  
  return testContent;
};

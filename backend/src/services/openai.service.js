
const { Configuration, OpenAIApi } = require('openai');

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generar test con OpenAI
const generateOpenAITest = async (options) => {
  const { language, level, questionCount, includeAnswers, studentName } = options;
  
  // Construir prompt según las opciones
  const prompt = `Crea un test de ${language} de nivel ${level} con ${questionCount} preguntas.
    El test debe incluir preguntas variadas (gramática, vocabulario, comprensión, etc.) 
    adecuadas para estudiantes de nivel ${level}.
    ${includeAnswers ? 'Incluye las respuestas correctas al final del test.' : 'No incluyas las respuestas.'}
    Formatea el test de manera clara, con numeración para cada pregunta.
    Este test es para el estudiante: ${studentName || 'un estudiante'}.
    Incluye un título al principio: "Test de ${language} - Nivel ${level}".
    Incluye la fecha actual: ${new Date().toLocaleDateString()}.`;
  
  try {
    // Usando la API de Chat Completions (GPT-4)
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Usando un modelo más disponible y rápido
      messages: [
        {
          role: "system",
          content: "Eres un profesor de idiomas profesional que crea tests para sus estudiantes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2048,
      temperature: 0.7,
    });
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al generar test con OpenAI:', error);
    throw new Error('No se pudo generar el test. Inténtalo de nuevo más tarde.');
  }
};

module.exports = {
  generateOpenAITest
};

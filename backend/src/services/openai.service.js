
const { Configuration, OpenAIApi } = require('openai');

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generar test con OpenAI
const generateOpenAITest = async (options) => {
  const { language, level, questionCount, includeAnswers } = options;
  
  // Construir prompt según las opciones
  const prompt = `Crea un test de ${language} de nivel ${level} con ${questionCount} preguntas.
    El test debe incluir preguntas variadas (gramática, vocabulario, comprensión, etc.) 
    adecuadas para estudiantes de nivel ${level}.
    ${includeAnswers ? 'Incluye las respuestas correctas al final del test.' : 'No incluyas las respuestas.'}
    Formatea el test de manera clara, con numeración para cada pregunta.`;
  
  try {
    const response = await openai.createCompletion({
      model: "gpt-4", // o el modelo que prefieras usar
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.7,
    });
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error al generar test con OpenAI:', error);
    throw new Error('No se pudo generar el test. Inténtalo de nuevo más tarde.');
  }
};

module.exports = {
  generateOpenAITest
};

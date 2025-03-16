
import { TestGenerationOptions } from '@/types/student';

// This would be replaced with actual API key in a secure environment
const MOCK_OPENAI_RESPONSE = (options: TestGenerationOptions) => {
  const { language, level, questionCount = 10 } = options;
  
  // This is a mock response that simulates what OpenAI would return
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

export const generateTest = async (options: TestGenerationOptions): Promise<string> => {
  // In a real implementation, this would call the OpenAI API
  // const response = await fetch('https://api.openai.com/v1/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-4o',
  //     prompt: `Create a ${options.language} language test for level ${options.level} with ${options.questionCount || 10} questions...`,
  //     max_tokens: 1500,
  //   }),
  // });
  // const data = await response.json();
  // return data.choices[0].text;

  // For demonstration purposes, return a mock response
  console.log('Generating test with options:', options);
  return MOCK_OPENAI_RESPONSE(options);
};

import { ai } from './genkit';

export async function testGoogleAI() {
  try {
    console.log('Testing Google AI API...');
    console.log('API Key available:', !!process.env.GOOGLE_AI_API_KEY);
    
    const result = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: 'Say hello world',
    });
    
    console.log('API test successful:', result.text());
    return result.text();
  } catch (error) {
    console.error('API test failed:', error);
    throw error;
  }
}
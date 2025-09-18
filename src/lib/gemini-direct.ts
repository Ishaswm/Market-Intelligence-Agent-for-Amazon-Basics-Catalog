import { MarketAnalysisReport } from './types';

const GEMINI_API_KEY = 'AIzaSyDMwKAGpQ0tyly_cvk5uXxXCl87Ebnk6_Q';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export async function generateMarketAnalysis(category: string): Promise<MarketAnalysisReport> {
  const prompt = `You are a senior market research analyst for Amazon Basics. Generate a comprehensive market analysis report for the "${category}" category.

Respond with ONLY a valid JSON object (no markdown, no code blocks, no additional text) with this exact structure:

{
  "category": "${category}",
  "executiveSummary": "A detailed 2-3 paragraph overview of the market opportunity, key trends, and strategic insights for the ${category} category.",
  "opportunities": [
    {
      "id": "opp-1",
      "name": "Specific Product Name",
      "category": "${category}",
      "description": "Detailed product description explaining what it is and why it's needed",
      "tam": 500000000,
      "estimatedCost": 15.50,
      "suggestedPrice": 29.99,
      "margin": 48,
      "competitorCount": 12,
      "easeOfEntry": "Medium",
      "overallScore": 7.5,
      "painPoints": ["specific customer pain point 1", "specific customer pain point 2", "specific customer pain point 3"],
      "keyFeatures": ["key differentiating feature 1", "key differentiating feature 2", "key differentiating feature 3"]
    },
    {
      "id": "opp-2",
      "name": "Another Product Name",
      "category": "${category}",
      "description": "Another product description",
      "tam": 300000000,
      "estimatedCost": 8.25,
      "suggestedPrice": 19.99,
      "margin": 58,
      "competitorCount": 8,
      "easeOfEntry": "Low",
      "overallScore": 8.2,
      "painPoints": ["pain point 1", "pain point 2"],
      "keyFeatures": ["feature 1", "feature 2", "feature 3"]
    },
    {
      "id": "opp-3",
      "name": "Third Product Name",
      "category": "${category}",
      "description": "Third product description",
      "tam": 750000000,
      "estimatedCost": 22.00,
      "suggestedPrice": 45.99,
      "margin": 52,
      "competitorCount": 15,
      "easeOfEntry": "High",
      "overallScore": 6.8,
      "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
      "keyFeatures": ["feature 1", "feature 2"]
    }
  ],
  "competitorAnalysis": [
    {
      "name": "Major Competitor 1",
      "marketShare": 25,
      "priceRange": "$20-35",
      "strengths": ["strong brand recognition", "wide distribution", "quality products"],
      "weaknesses": ["higher prices", "limited innovation", "poor customer service"]
    },
    {
      "name": "Major Competitor 2",
      "marketShare": 18,
      "priceRange": "$15-28",
      "strengths": ["competitive pricing", "good quality", "fast shipping"],
      "weaknesses": ["limited product range", "weak marketing", "inconsistent quality"]
    },
    {
      "name": "Major Competitor 3",
      "marketShare": 15,
      "priceRange": "$25-40",
      "strengths": ["premium quality", "innovative features", "strong reviews"],
      "weaknesses": ["high prices", "limited availability", "complex products"]
    },
    {
      "name": "Major Competitor 4",
      "marketShare": 12,
      "priceRange": "$10-22",
      "strengths": ["low prices", "basic functionality", "wide availability"],
      "weaknesses": ["poor quality", "limited features", "bad reviews"]
    },
    {
      "name": "Major Competitor 5",
      "marketShare": 10,
      "priceRange": "$18-32",
      "strengths": ["good design", "reliable products", "decent support"],
      "weaknesses": ["limited marketing", "higher costs", "slow innovation"]
    }
  ],
  "financialProjections": {
    "totalMarketSize": 2500000000,
    "estimatedRevenue": 75000000,
    "breakEvenPoint": 18,
    "roi": 42,
    "riskFactors": ["market saturation risk", "supply chain disruptions", "competitive pricing pressure", "regulatory changes", "consumer preference shifts"]
  },
  "recommendations": [
    "Focus on the highest-scoring opportunities with Low to Medium entry barriers",
    "Leverage Amazon's supply chain and logistics advantages for competitive pricing",
    "Prioritize products that address clear customer pain points with simple solutions",
    "Implement aggressive pricing strategy to gain market share quickly",
    "Focus on quality and reliability to build positive reviews and brand trust",
    "Consider bundling complementary products to increase average order value"
  ],
  "confidenceScore": 85
}

Generate realistic data based on actual market knowledge for the ${category} category. Ensure all numbers are realistic and TAM values are in actual USD amounts (not percentages). Make the opportunities specific and actionable for Amazon Basics.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response:', data);
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', generatedText);

    // Clean up the response - remove any markdown code blocks
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      const parsedData = JSON.parse(cleanedText);
      
      // Add the generatedAt timestamp
      const result: MarketAnalysisReport = {
        ...parsedData,
        generatedAt: new Date()
      };

      console.log('Successfully parsed market analysis:', result);
      return result;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Cleaned text:', cleanedText);
      throw new Error('Failed to parse market analysis response');
    }

  } catch (error) {
    console.error('Market analysis generation failed:', error);
    throw error;
  }
}
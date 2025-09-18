'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Simple input schema
const SimpleAnalysisInputSchema = z.object({
  category: z.string().describe('Product category to analyze'),
});

// Simple output schema matching our types
const SimpleAnalysisOutputSchema = z.object({
  category: z.string(),
  executiveSummary: z.string(),
  opportunities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    tam: z.number().positive(),
    estimatedCost: z.number().positive(),
    suggestedPrice: z.number().positive(),
    margin: z.number().min(0).max(100),
    competitorCount: z.number().min(0),
    easeOfEntry: z.enum(['Low', 'Medium', 'High']),
    overallScore: z.number().min(1).max(10),
    painPoints: z.array(z.string()),
    keyFeatures: z.array(z.string()),
  })),
  competitorAnalysis: z.array(z.object({
    name: z.string(),
    marketShare: z.number(),
    priceRange: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })),
  financialProjections: z.object({
    totalMarketSize: z.number(),
    estimatedRevenue: z.number(),
    breakEvenPoint: z.number(),
    roi: z.number(),
    riskFactors: z.array(z.string()),
  }),
  recommendations: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
  generatedAt: z.date(),
});

export const simpleMarketAnalysisFlow = ai.defineFlow({
  name: 'simpleMarketAnalysisFlow',
  inputSchema: SimpleAnalysisInputSchema,
  outputSchema: SimpleAnalysisOutputSchema,
}, async (input) => {
  const prompt = `You are a senior market research analyst for Amazon Basics. Generate a comprehensive market analysis report for the "${input.category}" category.

Provide a detailed JSON response with the following structure:

{
  "category": "${input.category}",
  "executiveSummary": "A 2-3 paragraph overview of the market opportunity",
  "opportunities": [
    {
      "id": "unique-id-1",
      "name": "Product Name",
      "category": "${input.category}",
      "description": "Product description",
      "tam": 500000000,
      "estimatedCost": 15.50,
      "suggestedPrice": 29.99,
      "margin": 48,
      "competitorCount": 12,
      "easeOfEntry": "Medium",
      "overallScore": 7.5,
      "painPoints": ["pain point 1", "pain point 2"],
      "keyFeatures": ["feature 1", "feature 2"]
    }
  ],
  "competitorAnalysis": [
    {
      "name": "Competitor Name",
      "marketShare": 25,
      "priceRange": "$20-35",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }
  ],
  "financialProjections": {
    "totalMarketSize": 2500000000,
    "estimatedRevenue": 50000000,
    "breakEvenPoint": 18,
    "roi": 35,
    "riskFactors": ["risk 1", "risk 2"]
  },
  "recommendations": ["recommendation 1", "recommendation 2"],
  "confidenceScore": 85
}

Generate 3-5 specific product opportunities, 5-7 key competitors, realistic financial projections, and 4-6 strategic recommendations. Base your analysis on realistic market data and Amazon Basics' strategy of providing quality basics at competitive prices.`;

  const result = await ai.generate({
    model: 'googleai/gemini-1.5-flash',
    prompt: prompt,
    output: {
      format: 'json',
      schema: SimpleAnalysisOutputSchema.omit({ generatedAt: true }),
    },
  });

  const output = result.output();
  
  return {
    ...output,
    generatedAt: new Date(),
  };
});

export async function runSimpleMarketAnalysis(category: string) {
  try {
    const result = await simpleMarketAnalysisFlow({ category });
    return result;
  } catch (error) {
    console.error('Market analysis failed:', error);
    throw new Error('Failed to generate market analysis. Please try again.');
  }
}
'use server';

/**
 * @fileOverview This flow generates a business report for a potential new product.
 *
 * - generateBusinessReport - Generates a detailed business report for a given product idea.
 * - GenerateBusinessReportInput - The input type for the generateBusinessReport function.
 * - GenerateBusinessReportOutput - The return type for the generateBusinessReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessReportInputSchema = z.object({
  productIdea: z.string().describe('The name of the potential product.'),
  customerPainPoints: z
    .string()
    .describe('A summary of customer pain points from reviews.'),
  marketTrends: z
    .string()
    .describe('A summary of relevant market trends.'),
});
export type GenerateBusinessReportInput = z.infer<
  typeof GenerateBusinessReportInputSchema
>;

const GenerateBusinessReportOutputSchema = z.object({
  financialModeling: z.string().describe('A high-level financial projection, including estimated TAM, potential revenue, and key cost considerations.'),
  opportunityScoring: z.string().describe('An analysis of the product\'s potential, scoring it on factors like market demand, competition, and alignment with Amazon Basics\' strategy. Provide a final score out of 10.'),
  competitiveAnalysis: z.string().describe('An overview of the competitive landscape, identifying key competitors and their strengths and weaknesses.'),
  marketTrends: z.string().describe('A summary of the market trends that support the viability of this product idea.'),
});
export type GenerateBusinessReportOutput = z.infer<
  typeof GenerateBusinessReportOutputSchema
>;

export async function generateBusinessReport(
  input: GenerateBusinessReportInput
): Promise<GenerateBusinessReportOutput> {
  return generateBusinessReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessReportPrompt',
  input: {schema: GenerateBusinessReportInputSchema},
  output: {schema: GenerateBusinessReportOutputSchema},
  prompt: `You are a senior product manager at Amazon Basics. Your task is to create a comprehensive business report for a potential new product.

Product Idea: {{{productIdea}}}

Customer Pain Points (from competitor reviews):
{{{customerPainPoints}}}

Relevant Market Trends:
{{{marketTrends}}}

Based on the information above, generate a detailed business report covering the following sections:
1.  **Financial Modeling:** Provide a high-level financial projection. Include estimated Total Addressable Market (TAM), potential annual revenue, and key cost considerations (manufacturing, marketing, etc.).
2.  **Opportunity Scoring:** Analyze the product's potential. Score it on market demand, competitive intensity, and strategic alignment with the Amazon Basics brand. Provide a final score out of 10 and a justification.
3.  **Competitive Analysis:** Briefly summarize the competitive landscape. Who are the main competitors? What are their strengths and weaknesses? How can an Amazon Basics product differentiate itself?
4.  **Market Trends:** Explain how current market trends support this product idea. Reference the provided trends and any other relevant industry insights.

Please provide the report in the structured format defined by the output schema.`,
});

const generateBusinessReportFlow = ai.defineFlow(
  {
    name: 'generateBusinessReportFlow',
    inputSchema: GenerateBusinessReportInputSchema,
    outputSchema: GenerateBusinessReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

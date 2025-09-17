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
  financialModeling: z.string().describe("An analysis of the Total Addressable Market (TAM), estimated cost of production, and potential pricing strategy."),
  opportunityScoring: z.string().describe("An assessment of the product's potential, including estimated time to market, penetration potential, and ease of market entry. Provide a final score out of 10."),
  competitiveAnalysis: z.string().describe('An overview of the competitive landscape, identifying key competitors, their strengths, weaknesses, and potential differentiation for an Amazon Basics product.'),
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
  prompt: `You are a senior product manager at Amazon Basics. Your task is to create a comprehensive business report for a potential new product based on market analysis.

Product Idea: {{{productIdea}}}

Market Analysis Summary (incorporating customer pain points and market trends):
{{{marketTrends}}}

Based on the information above, generate a detailed business report covering the following sections:
1.  **Financial Modeling:** Provide a high-level financial projection. Analyze the Total Addressable Market (TAM), estimate the cost of production per unit, and suggest a potential retail pricing strategy to ensure a healthy margin.
2.  **Opportunity Scoring:** Analyze the product's potential. Estimate the time to enter the market (in months), assess the market penetration potential (High, Medium, Low), and the ease of entry. Provide a final opportunity score out of 10 with a clear justification.
3.  **Competitive Analysis:** Summarize the competitive landscape. Identify the main competitors, their strengths and weaknesses, and how an Amazon Basics version of this product could differentiate itself (e.g., on price, features, quality).
4.  **Market Trends:** Explain how current market trends support this product idea. Use the provided market analysis to highlight key growth drivers and consumer behaviors.

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

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
  executiveSummary: z.string().describe('A high-level overview of the business case for the new product.'),
  targetAudience: z.string().describe('A description of the ideal customer profile for this product.'),
  featureSuggestions: z.array(z.string()).describe('A list of recommended features for the product based on customer pain points.'),
  marketingStrategy: z.string().describe('Recommendations for how to market the new product.'),
  pricingAnalysis: z.string().describe('A suggested retail price and analysis of the pricing strategy.'),
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
1.  **Executive Summary:** A concise overview of the opportunity and why Amazon Basics should pursue it.
2.  **Target Audience:** Describe the ideal customer for this product.
3.  **Feature Suggestions:** List key features that will address the identified customer pain points.
4.  **Marketing Strategy:** Suggest key channels and messaging for launching this product.
5.  **Pricing Analysis:** Recommend a competitive retail price and justify it.

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

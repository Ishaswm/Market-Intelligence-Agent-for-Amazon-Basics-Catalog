'use server';

/**
 * @fileOverview This flow analyzes a product category to suggest new product opportunities for Amazon Basics.
 *
 * - findProductOpportunities - Analyzes a category and suggests products.
 * - FindProductOpportunitiesInput - The input type for the findProductOpportunities function.
 * - FindProductOpportunitiesOutput - The return type for the findProductOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindProductOpportunitiesInputSchema = z.object({
  productCategory: z
    .string()
    .describe('The product category to analyze (e.g., "kitchen gadgets", "home office accessories").'),
});

export type FindProductOpportunitiesInput = z.infer<
  typeof FindProductOpportunitiesInputSchema
>;

const ProductSuggestionSchema = z.object({
    name: z.string().describe('The name of the suggested product.'),
    description: z.string().describe('A brief description of the product and the rationale for why it would be a successful Amazon Basics product.')
});

const FindProductOpportunitiesOutputSchema = z.object({
  analysisSummary: z.string().describe("A concise summary of the key market trends and customer pain points identified in the category."),
  productSuggestions: z.array(ProductSuggestionSchema).describe('A list of new product recommendations based on the analysis.'),
});

export type FindProductOpportunitiesOutput = z.infer<
  typeof FindProductOpportunitiesOutputSchema
>;

export async function findProductOpportunities(
  input: FindProductOpportunitiesInput
): Promise<FindProductOpportunitiesOutput> {
  return findProductOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findProductOpportunitiesPrompt',
  input: {schema: FindProductOpportunitiesInputSchema},
  output: {schema: FindProductOpportunitiesOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a senior product strategist for Amazon Basics. Your goal is to identify high-potential new product opportunities within a given category by analyzing market trends and common customer pain points.

Your task is to analyze the product category: '{{{productCategory}}}'.

1.  **Analyze the Market**: Based on your knowledge, identify the top 2-3 market trends and the most common customer pain points for products in this category. Synthesize this into a brief "Analysis Summary".
2.  **Suggest Products**: Based on your analysis, suggest three innovative yet practical products that Amazon Basics could launch. For each suggestion, provide a product name and a description that explains how it addresses the identified pain points and aligns with market trends.

The products should be a good fit for the Amazon Basics brand, meaning they should target the mass market, be cost-effective to produce, and solve common problems.`,
});

const findProductOpportunitiesFlow = ai.defineFlow(
  {
    name: 'findProductOpportunitiesFlow',
    inputSchema: FindProductOpportunitiesInputSchema,
    outputSchema: FindProductOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

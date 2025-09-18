'use server';

/**
 * @fileOverview This flow analyzes a product category to summarize market trends and customer pain points for potential Amazon Basics products.
 *
 * - summarizeMarketData - Analyzes a category and returns distinct summaries.
 * - SummarizeMarketDataInput - The input type for the summarizeMarketData function.
 * - SummarizeMarketDataOutput - The return type for the summarizeMarketData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMarketDataInputSchema = z.object({
  productCategory: z
    .string()
    .describe('The product category to analyze (e.g., "kitchen gadgets", "home office accessories").'),
});

export type SummarizeMarketDataInput = z.infer<
  typeof SummarizeMarketDataInputSchema
>;

const SummarizeMarketDataOutputSchema = z.object({
  marketTrends: z.string().describe("A concise summary of the key market trends in the category."),
  customerPainPoints: z.string().describe("A concise summary of the most common customer pain points in the category.")
});

export type SummarizeMarketDataOutput = z.infer<
  typeof SummarizeMarketDataOutputSchema
>;

export async function summarizeMarketData(
  input: SummarizeMarketDataInput
): Promise<SummarizeMarketDataOutput> {
  return summarizeMarketDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketDataPrompt',
  input: {schema: SummarizeMarketDataInputSchema},
  output: {schema: SummarizeMarketDataOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a senior market analyst for Amazon Basics. Your goal is to analyze a given product category to extract key market trends and common customer pain points to inform new product decisions for the Amazon Basics catalog.

Your task is to analyze the product category: '{{{productCategory}}}'.

1.  **Market Trends**: Based on your knowledge, identify and summarize the top 2-3 market trends for products in this category.
2.  **Customer Pain Points**: Based on your knowledge, identify and summarize the most common customer complaints or unmet needs for products in this category.

Provide two distinct, concise summaries based on your analysis.`,
});

const summarizeMarketDataFlow = ai.defineFlow(
  {
    name: 'summarizeMarketDataFlow',
    inputSchema: SummarizeMarketDataInputSchema,
    outputSchema: SummarizeMarketDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

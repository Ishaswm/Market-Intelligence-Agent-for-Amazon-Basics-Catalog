// src/ai/flows/suggest-trending-products.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests trending product categories for Amazon Basics.
 *
 * - suggestTrendingProducts - A function that suggests trending product categories.
 * - SuggestTrendingProductsInput - The input type for the suggestTrendingProducts function (currently empty).
 * - SuggestTrendingProductsOutput - The return type for the suggestTrendingProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrendingProductsInputSchema = z.object({});
export type SuggestTrendingProductsInput = z.infer<typeof SuggestTrendingProductsInputSchema>;

const SuggestTrendingProductsOutputSchema = z.object({
  productCategories: z
    .array(z.string())
    .describe('An array of trending product categories.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested product categories, including market trends and data sources.'
    ),
});
export type SuggestTrendingProductsOutput = z.infer<typeof SuggestTrendingProductsOutputSchema>;

export async function suggestTrendingProducts(
  input: SuggestTrendingProductsInput
): Promise<SuggestTrendingProductsOutput> {
  return suggestTrendingProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrendingProductsPrompt',
  input: {schema: SuggestTrendingProductsInputSchema},
  output: {schema: SuggestTrendingProductsOutputSchema},
  prompt: `You are a market intelligence analyst for Amazon Basics.
Your goal is to identify trending product categories that Amazon Basics could potentially launch.

Analyze e-commerce data, Google Trends, and other market reports to identify these trends.
Consider customer pain points, unmet needs, and competitive landscapes.
Provide a list of product categories and your reasoning for suggesting them.

Output should be in the format:
{
  "productCategories": ["category1", "category2", ...],
  "reasoning": "Explanation of why these categories are trending."
}
`,
});

const suggestTrendingProductsFlow = ai.defineFlow(
  {
    name: 'suggestTrendingProductsFlow',
    inputSchema: SuggestTrendingProductsInputSchema,
    outputSchema: SuggestTrendingProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

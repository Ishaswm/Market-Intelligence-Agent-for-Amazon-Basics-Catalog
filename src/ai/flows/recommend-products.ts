'use server';

/**
 * @fileOverview This flow recommends new Amazon Basics products based on customer pain points and market trends.
 *
 * - recommendProducts - Recommends new products.
 * - RecommendProductsInput - The input type for the recommendProducts function.
 * - RecommendProductsOutput - The return type for the recommendProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendProductsInputSchema = z.object({
  customerPainPoints: z
    .string()
    .describe('A summary of customer pain points from competitor reviews.'),
  marketTrends: z
    .string()
    .describe('A summary of relevant market trends.'),
});

export type RecommendProductsInput = z.infer<
  typeof RecommendProductsInputSchema
>;

const ProductSuggestionSchema = z.object({
    name: z.string().describe('The name of the suggested product.'),
    description: z.string().describe('A brief description of the product and why it would be successful.')
});

const RecommendProductsOutputSchema = z.object({
  productSuggestions: z.array(ProductSuggestionSchema).describe('A list of new product recommendations.'),
});

export type RecommendProductsOutput = z.infer<
  typeof RecommendProductsOutputSchema
>;

export async function recommendProducts(
  input: RecommendProductsInput
): Promise<RecommendProductsOutput> {
  return recommendProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendProductsPrompt',
  input: {schema: RecommendProductsInputSchema},
  output: {schema: RecommendProductsOutputSchema},
  prompt: `You are a senior product strategist for Amazon Basics. Your goal is to brainstorm new product ideas that directly address customer needs and align with current market trends.

Analyze the provided customer pain points and market trends to suggest three innovative, high-potential products that Amazon Basics could launch.

Customer Pain Points (from competitor reviews):
{{{customerPainPoints}}}

Relevant Market Trends:
{{{marketTrends}}}

Based on this data, provide a list of new product suggestions. For each suggestion, provide a name and a short description explaining the product concept and its potential.`,
});

const recommendProductsFlow = ai.defineFlow(
  {
    name: 'recommendProductsFlow',
    inputSchema: RecommendProductsInputSchema,
    outputSchema: RecommendProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

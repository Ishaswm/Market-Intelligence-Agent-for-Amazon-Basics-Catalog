'use server';

/**
 * @fileOverview This flow analyzes customer reviews to identify pain points.
 *
 * - analyzeCustomerSentiment - Analyzes customer reviews of competitor products to extract common pain points and unmet needs.
 * - AnalyzeCustomerSentimentInput - The input type for the analyzeCustomerSentiment function.
 * - AnalyzeCustomerSentimentOutput - The return type for the analyzeCustomerSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCustomerSentimentInputSchema = z.object({
  productReviews: z
    .string()
    .describe('Customer reviews of competitor products.'),
});

export type AnalyzeCustomerSentimentInput = z.infer<
  typeof AnalyzeCustomerSentimentInputSchema
>;

const AnalyzeCustomerSentimentOutputSchema = z.object({
  summary: z.string().describe('A summary of the main customer pain points.'),
});

export type AnalyzeCustomerSentimentOutput = z.infer<
  typeof AnalyzeCustomerSentimentOutputSchema
>;

export async function analyzeCustomerSentiment(
  input: AnalyzeCustomerSentimentInput
): Promise<AnalyzeCustomerSentimentOutput> {
  return analyzeCustomerSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSentimentPrompt',
  input: {schema: AnalyzeCustomerSentimentInputSchema},
  output: {schema: AnalyzeCustomerSentimentOutputSchema},
  prompt: `You are a product analyst. Analyze the following customer reviews and summarize the main pain points:

Customer Reviews:
{{{productReviews}}}

Summary of main pain points:`,
});

const analyzeCustomerSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSentimentFlow',
    inputSchema: AnalyzeCustomerSentimentInputSchema,
    outputSchema: AnalyzeCustomerSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

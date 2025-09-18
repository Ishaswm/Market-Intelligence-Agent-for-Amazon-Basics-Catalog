'use server';

/**
 * @fileOverview This flow generates a business report for a potential new Amazon Basics product.
 *
 * - generateBusinessReport - Generates a detailed business report for a given product idea.
 * - GenerateBusinessReportInput - The input type for the generateBusinessReport function.
 * - GenerateBusinessReportOutput - The return type for the generateBusinessReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessReportInputSchema = z.object({
  productIdea: z.string().describe('The name of the potential product for the Amazon Basics catalog.'),
  marketAnalysisSummary: z
    .string()
    .describe('A summary of market trends and customer pain points.'),
});
export type GenerateBusinessReportInput = z.infer<
  typeof GenerateBusinessReportInputSchema
>;

const OpportunityScoringSchema = z.object({
    timeToMarketInMonths: z.number().describe('The estimated time in months to bring the product to market.'),
    penetrationPotential: z.enum(["High", "Medium", "Low"]).describe('The potential for market penetration.'),
    easeOfEntry: z.enum(["High", "Medium", "Low"]).describe('The ease of entering the market.'),
    scoreOutOfTen: z.number().min(1).max(10).describe('A final opportunity score out of 10, where 10 is the highest potential.'),
    justification: z.string().describe('A brief justification for the given score.')
});

const GenerateBusinessReportOutputSchema = z.object({
  financialModeling: z.string().describe("An analysis of the Total Addressable Market (TAM), estimated cost of production, and potential pricing strategy, presented in bullet points."),
  opportunityScoring: OpportunityScoringSchema,
  competitiveAnalysis: z.string().describe('An overview of the competitive landscape, identifying key competitors, their strengths, weaknesses, and potential differentiation for an Amazon Basics product, presented in bullet points.'),
  marketTrends: z.string().describe('A summary of the market trends that support the viability of this product idea, presented in bullet points.'),
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
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a senior product manager at Amazon Basics. Your task is to create a comprehensive business report for a potential new product to be added to the Amazon Basics catalog.

Product Idea: {{{productIdea}}}

Market Analysis Summary (incorporating customer pain points and market trends):
{{{marketAnalysisSummary}}}

Based on the information above, generate a detailed business report covering the following sections. Please use bullet points for text-based sections to ensure clarity and professionalism.
1.  **Financial Modeling:** Provide a high-level financial projection. Analyze the Total Addressable Market (TAM), estimate the cost of production per unit, and suggest a potential retail pricing strategy to ensure a healthy margin for an Amazon Basics product.
2.  **Opportunity Scoring:** Analyze the product's potential. Estimate the time to enter the market (in months), assess the market penetration potential (High, Medium, Low), and the ease of entry (High, Medium, Low). Provide a final opportunity score out of 10 with a clear justification.
3.  **Competitive Analysis:** Summarize the competitive landscape. Identify the main competitors, their strengths and weaknesses, and how an Amazon Basics version of this product could differentiate itself (e.g., on price, features, quality, simplicity).
4.  **Market Trends:** Explain how current market trends support this product idea. Use the provided market analysis to highlight key growth drivers and consumer behaviors relevant to the Amazon Basics customer base.

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

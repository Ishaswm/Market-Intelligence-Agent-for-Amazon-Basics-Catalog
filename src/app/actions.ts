'use server'

import { analyzeCustomerSentiment } from "@/ai/flows/analyze-customer-sentiment";
import { suggestTrendingProducts } from "@/ai/flows/suggest-trending-products";
import { z } from "zod";

interface SuggestTrendsState {
  productCategories?: string[];
  reasoning?: string;
  error?: string;
}

export async function suggestTrendsAction(
  prevState: SuggestTrendsState,
  formData: FormData
): Promise<SuggestTrendsState> {
  try {
    const result = await suggestTrendingProducts({});
    return result;
  } catch (error) {
    console.error(error);
    return { error: "Failed to suggest trends. Please try again." };
  }
}

interface AnalyzeSentimentState {
    summary?: string;
    error?: string;
}

const sentimentSchema = z.object({
    reviews: z.string().min(10, 'Please enter at least 10 characters of review text.'),
});

export async function analyzeSentimentAction(
    prevState: AnalyzeSentimentState,
    formData: FormData
): Promise<AnalyzeSentimentState> {
    const validatedFields = sentimentSchema.safeParse({
        reviews: formData.get('reviews'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }

    try {
        const result = await analyzeCustomerSentiment({ productReviews: validatedFields.data.reviews });
        return { summary: result.summary };
    } catch (error) {
        console.error(error);
        return { error: "Failed to analyze sentiment. Please try again." };
    }
}

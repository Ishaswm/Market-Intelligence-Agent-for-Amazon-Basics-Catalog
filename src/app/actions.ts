'use server'

import { generateBusinessReport } from "@/ai/flows/generate-business-report";
import type { GenerateBusinessReportOutput } from "@/ai/flows/generate-business-report";
import { findProductOpportunities } from "@/ai/flows/find-product-opportunities";
import type { FindProductOpportunitiesOutput } from "@/ai/flows/find-product-opportunities";
import { z } from "zod";


interface GenerateReportState {
    report?: GenerateBusinessReportOutput;
    error?: string;
}

const reportSchema = z.object({
    productIdea: z.string().min(3, 'Please enter a product idea.'),
    customerPainPoints: z.string().min(10, 'Please enter customer pain points.'),
    marketTrends: z.string().min(10, 'Please enter market trends.'),
});

export async function generateReportAction(
    prevState: GenerateReportState,
    formData: FormData
): Promise<GenerateReportState> {
    const validatedFields = reportSchema.safeParse({
        productIdea: formData.get('productIdea'),
        customerPainPoints: formData.get('customerPainPoints'),
        marketTrends: formData.get('marketTrends'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }

    try {
        const result = await generateBusinessReport(validatedFields.data);
        return { report: result };
    } catch (error) {
        console.error(error);
        return { error: "Failed to generate report. Please try again." };
    }
}


interface FindProductOpportunitiesState extends Partial<FindProductOpportunitiesOutput> {
    error?: string;
}

const findOpportunitiesSchema = z.object({
    productCategory: z.string().min(3, 'Please enter a product category with at least 3 characters.'),
});

export async function findProductOpportunitiesAction(
    prevState: FindProductOpportunitiesState,
    formData: FormData
): Promise<FindProductOpportunitiesState> {
    const validatedFields = findOpportunitiesSchema.safeParse({
        productCategory: formData.get('productCategory'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.errors.map((e) => e.message).join(', '),
        };
    }

    try {
        const result = await findProductOpportunities(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        return { error: "Failed to find product opportunities. Please try again." };
    }
}

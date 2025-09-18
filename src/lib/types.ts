import { z } from 'zod';

// Legacy type for backward compatibility
export type Opportunity = {
  id: string;
  name: string;
  category: string;
  tam: number;
  margin: number;
  easeOfEntry: number;
  score: number;
  imageUrl: string;
  imageHint: string;
};

// Simplified Market Analysis Input
export const MarketAnalysisInputSchema = z.object({
  category: z.string().min(1, "Category is required"),
  keywords: z.array(z.string()).optional(),
  targetPrice: z.number().positive().optional(),
});

export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

// Enhanced Market Opportunity (simplified)
export const MarketOpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  
  // Key metrics
  tam: z.number().positive(),
  estimatedCost: z.number().positive(),
  suggestedPrice: z.number().positive(),
  margin: z.number().min(0).max(100),
  competitorCount: z.number().min(0),
  easeOfEntry: z.enum(['Low', 'Medium', 'High']),
  overallScore: z.number().min(1).max(10),
  
  // Simple metadata
  painPoints: z.array(z.string()),
  keyFeatures: z.array(z.string()),
  imageUrl: z.string().optional(),
});

export type MarketOpportunity = z.infer<typeof MarketOpportunitySchema>;

// Simplified Competitor
export const CompetitorSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export type Competitor = z.infer<typeof CompetitorSchema>;
// Simple Market Analysis Report
export const MarketAnalysisReportSchema = z.object({
  category: z.string(),
  executiveSummary: z.string(),
  opportunities: z.array(MarketOpportunitySchema),
  competitorAnalysis: z.array(z.object({
    name: z.string(),
    marketShare: z.number(),
    priceRange: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })),
  financialProjections: z.object({
    totalMarketSize: z.number(),
    estimatedRevenue: z.number(),
    breakEvenPoint: z.number(),
    roi: z.number(),
    riskFactors: z.array(z.string()),
  }),
  recommendations: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
  generatedAt: z.date(),
});

export type MarketAnalysisReport = z.infer<typeof MarketAnalysisReportSchema>;
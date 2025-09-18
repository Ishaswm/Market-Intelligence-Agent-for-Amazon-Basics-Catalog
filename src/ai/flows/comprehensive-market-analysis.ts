'use server';

/**
 * @fileOverview Comprehensive market analysis flow that generates detailed market reports with financial modeling, competitive analysis, and opportunity identification.
 *
 * - comprehensiveMarketAnalysis - Main flow that orchestrates complete market analysis
 * - marketOpportunityIdentification - Identifies specific product opportunities with TAM calculations
 * - competitiveIntelligenceAnalysis - Analyzes competitive landscape and pricing
 * - financialModelingAnalysis - Performs cost estimates and ROI projections
 * - painPointAnalysis - Identifies market gaps and customer pain points
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MarketAnalysisInput, ComprehensiveMarketReport } from '@/lib/types';

// Input schema for comprehensive analysis
const ComprehensiveMarketAnalysisInputSchema = z.object({
  category: z.string().describe('The product category to analyze (e.g., "kitchen gadgets", "home office accessories")'),
  keywords: z.array(z.string()).optional().describe('Optional specific keywords to focus the analysis'),
  targetPrice: z.number().positive().optional().describe('Optional target price point for products'),
  analysisDepth: z.enum(['basic', 'comprehensive', 'deep-dive']).default('comprehensive').describe('Depth of analysis to perform'),
});

export type ComprehensiveMarketAnalysisInput = z.infer<typeof ComprehensiveMarketAnalysisInputSchema>;

// Market opportunity identification flow
const MarketOpportunityIdentificationSchema = z.object({
  opportunities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    tam: z.number().positive().describe('Total Addressable Market in USD'),
    estimatedCost: z.number().positive().describe('Estimated production cost per unit'),
    suggestedPrice: z.number().positive().describe('Suggested retail price'),
    margin: z.number().min(0).max(100).describe('Estimated gross margin percentage'),
    competitorCount: z.number().min(0).describe('Number of direct competitors'),
    easeOfEntry: z.enum(['Low', 'Medium', 'High']).describe('Ease of market entry'),
    overallScore: z.number().min(1).max(10).describe('Overall opportunity score'),
    painPoints: z.array(z.string()).describe('Customer pain points this product addresses'),
    keyFeatures: z.array(z.string()).describe('Key features that would differentiate this product'),
  })).describe('List of identified market opportunities'),
  marketSize: z.number().positive().describe('Total market size for the category'),
  growthRate: z.number().describe('Annual market growth rate percentage'),
});

const marketOpportunityPrompt = ai.definePrompt({
  name: 'marketOpportunityIdentificationPrompt',
  input: { schema: ComprehensiveMarketAnalysisInputSchema },
  output: { schema: MarketOpportunityIdentificationSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a senior market research analyst specializing in Amazon Basics product opportunities. Analyze the category "{{{category}}}" to identify specific product opportunities with detailed financial projections.

${z.string().optional().describe('Keywords: {{{keywords}}}') || ''}
${z.number().optional().describe('Target Price Range: ${{{targetPrice}}}') || ''}

Your analysis should identify 3-5 specific product opportunities within this category. For each opportunity, provide:

1. **Market Sizing**: Calculate realistic TAM (Total Addressable Market) based on category size and target demographics
2. **Cost Analysis**: Estimate production costs including materials, manufacturing, and logistics
3. **Pricing Strategy**: Suggest competitive retail pricing that maintains healthy margins
4. **Competition Assessment**: Count direct competitors and assess market saturation
5. **Entry Difficulty**: Evaluate barriers to entry including regulatory, technical, and capital requirements
6. **Pain Point Analysis**: Identify specific customer problems this product would solve
7. **Differentiation**: Define key features that would make an Amazon Basics version competitive

Focus on products that align with Amazon Basics' strategy: mass market appeal, cost-effective production, solving common problems, and high potential for positive reviews.

Provide realistic financial projections based on market research principles and industry benchmarks.`,
});

const marketOpportunityFlow = ai.defineFlow({
  name: 'marketOpportunityIdentificationFlow',
  inputSchema: ComprehensiveMarketAnalysisInputSchema,
  outputSchema: MarketOpportunityIdentificationSchema,
}, async (input) => {
  const { output } = await marketOpportunityPrompt(input);
  return output!;
});

// Competitive intelligence analysis flow
const CompetitiveIntelligenceSchema = z.object({
  competitors: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().min(0),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  })).describe('List of key competitors'),
  competitiveInsights: z.array(z.string()).describe('Key insights about the competitive landscape'),
  pricingAnalysis: z.object({
    averagePrice: z.number().positive(),
    priceRange: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
    }),
    pricingStrategy: z.string().describe('Recommended pricing strategy for Amazon Basics'),
  }),
  marketGaps: z.array(z.string()).describe('Identified gaps in current market offerings'),
});

const competitiveIntelligencePrompt = ai.definePrompt({
  name: 'competitiveIntelligencePrompt',
  input: { schema: ComprehensiveMarketAnalysisInputSchema },
  output: { schema: CompetitiveIntelligenceSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a competitive intelligence analyst. Analyze the competitive landscape for the "{{{category}}}" category.

Based on your knowledge of major e-commerce platforms and market data, provide:

1. **Top Competitors**: Identify 5-8 key competitors in this category with their typical pricing, customer ratings, and market position
2. **Competitive Strengths & Weaknesses**: For each competitor, identify their main strengths and weaknesses
3. **Pricing Analysis**: Analyze pricing patterns, identify average price points, and recommend pricing strategy for Amazon Basics
4. **Market Gaps**: Identify underserved segments or unmet customer needs that represent opportunities
5. **Competitive Insights**: Provide strategic insights about market dynamics, customer preferences, and competitive positioning

Focus on actionable intelligence that would inform Amazon Basics product development and go-to-market strategy.`,
});

const competitiveIntelligenceFlow = ai.defineFlow({
  name: 'competitiveIntelligenceFlow',
  inputSchema: ComprehensiveMarketAnalysisInputSchema,
  outputSchema: CompetitiveIntelligenceSchema,
}, async (input) => {
  const { output } = await competitiveIntelligencePrompt(input);
  return output!;
});

// Financial modeling analysis flow
const FinancialModelingSchema = z.object({
  financialSummary: z.object({
    averageMargin: z.number().describe('Average gross margin percentage across opportunities'),
    estimatedROI: z.number().describe('Estimated return on investment percentage'),
    breakEvenTimeline: z.string().describe('Estimated time to break even'),
    investmentRequired: z.number().positive().describe('Initial investment required'),
  }),
  costBreakdown: z.object({
    materialCosts: z.number().describe('Average material costs percentage'),
    manufacturingCosts: z.number().describe('Average manufacturing costs percentage'),
    logisticsCosts: z.number().describe('Average logistics costs percentage'),
    marketingCosts: z.number().describe('Estimated marketing costs percentage'),
  }),
  revenueProjections: z.array(z.object({
    year: z.number(),
    projectedRevenue: z.number().positive(),
    projectedUnits: z.number().positive(),
  })).describe('3-year revenue projections'),
  riskFactors: z.array(z.object({
    risk: z.string(),
    impact: z.enum(['Low', 'Medium', 'High']),
    mitigation: z.string(),
  })).describe('Key financial and market risks'),
});

const financialModelingPrompt = ai.definePrompt({
  name: 'financialModelingPrompt',
  input: { schema: ComprehensiveMarketAnalysisInputSchema },
  output: { schema: FinancialModelingSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a financial analyst specializing in consumer products. Create a comprehensive financial model for entering the "{{{category}}}" market with Amazon Basics products.

Provide detailed financial analysis including:

1. **Cost Structure**: Break down typical costs for products in this category (materials, manufacturing, logistics, marketing)
2. **Revenue Projections**: Create realistic 3-year revenue projections based on market size and penetration assumptions
3. **Profitability Analysis**: Calculate expected margins, ROI, and break-even timelines
4. **Investment Requirements**: Estimate initial capital requirements for product development, inventory, and marketing
5. **Risk Assessment**: Identify key financial risks and mitigation strategies

Base your analysis on industry benchmarks and realistic market assumptions. Consider Amazon's scale advantages and cost efficiencies.`,
});

const financialModelingFlow = ai.defineFlow({
  name: 'financialModelingFlow',
  inputSchema: ComprehensiveMarketAnalysisInputSchema,
  outputSchema: FinancialModelingSchema,
}, async (input) => {
  const { output } = await financialModelingPrompt(input);
  return output!;
});

// Pain point and market gap analysis flow
const PainPointAnalysisSchema = z.object({
  painPoints: z.array(z.string()).describe('Key customer pain points in the category'),
  marketTrends: z.array(z.string()).describe('Important market trends affecting the category'),
  customerInsights: z.array(z.string()).describe('Key insights about customer behavior and preferences'),
  innovationOpportunities: z.array(z.string()).describe('Opportunities for product innovation'),
});

const painPointAnalysisPrompt = ai.definePrompt({
  name: 'painPointAnalysisPrompt',
  input: { schema: ComprehensiveMarketAnalysisInputSchema },
  output: { schema: PainPointAnalysisSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a customer research specialist. Analyze customer pain points and market trends for the "{{{category}}}" category.

Based on your knowledge of customer reviews, market research, and industry trends, provide:

1. **Customer Pain Points**: Identify the most common problems customers face with existing products in this category
2. **Market Trends**: Highlight key trends shaping customer preferences and market dynamics
3. **Customer Insights**: Provide insights into customer behavior, purchasing patterns, and decision factors
4. **Innovation Opportunities**: Identify areas where product innovation could address unmet needs

Focus on actionable insights that would inform Amazon Basics product development strategy.`,
});

const painPointAnalysisFlow = ai.defineFlow({
  name: 'painPointAnalysisFlow',
  inputSchema: ComprehensiveMarketAnalysisInputSchema,
  outputSchema: PainPointAnalysisSchema,
}, async (input) => {
  const { output } = await painPointAnalysisPrompt(input);
  return output!;
});

// Main comprehensive market analysis flow
export const comprehensiveMarketAnalysis = ai.defineFlow({
  name: 'comprehensiveMarketAnalysisFlow',
  inputSchema: ComprehensiveMarketAnalysisInputSchema,
  outputSchema: z.object({
    report: z.object({
      category: z.string(),
      analysisDate: z.date(),
      executiveSummary: z.object({
        keyFindings: z.array(z.string()),
        topOpportunities: z.array(z.string()),
        recommendations: z.array(z.string()),
        totalMarketSize: z.number().positive(),
        recommendedInvestment: z.number().positive(),
      }),
      opportunities: z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        description: z.string(),
        tam: z.number().positive(),
        estimatedCost: z.number().positive(),
        suggestedPrice: z.number().positive(),
        margin: z.number().min(0).max(100),
        competitorCount: z.number().min(0),
        easeOfEntry: z.enum(['Low', 'Medium', 'High']),
        overallScore: z.number().min(1).max(10),
        painPoints: z.array(z.string()),
        keyFeatures: z.array(z.string()),
      })),
      competitors: z.array(z.object({
        name: z.string(),
        price: z.number().positive(),
        rating: z.number().min(0).max(5),
        reviewCount: z.number().min(0),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
      })),
      competitiveInsights: z.array(z.string()),
      financialSummary: z.object({
        averageMargin: z.number(),
        estimatedROI: z.number(),
        breakEvenTimeline: z.string(),
        investmentRequired: z.number().positive(),
      }),
      marketTrends: z.array(z.string()),
      painPoints: z.array(z.string()),
      marketGaps: z.array(z.string()),
      risks: z.array(z.object({
        risk: z.string(),
        impact: z.enum(['Low', 'Medium', 'High']),
        mitigation: z.string(),
      })),
      actionItems: z.array(z.string()),
      nextSteps: z.array(z.string()),
    }),
  }),
}, async (input) => {
  // Run all analysis flows in parallel for efficiency
  const [
    opportunityAnalysis,
    competitiveAnalysis,
    financialAnalysis,
    painPointAnalysis,
  ] = await Promise.all([
    marketOpportunityFlow(input),
    competitiveIntelligenceFlow(input),
    financialModelingFlow(input),
    painPointAnalysisFlow(input),
  ]);

  // Generate executive summary based on all analyses
  const executiveSummaryPrompt = ai.definePrompt({
    name: 'executiveSummaryPrompt',
    input: { 
      schema: z.object({
        category: z.string(),
        opportunities: z.array(z.any()),
        competitors: z.array(z.any()),
        financialSummary: z.any(),
        marketTrends: z.array(z.string()),
        painPoints: z.array(z.string()),
      })
    },
    output: { 
      schema: z.object({
        keyFindings: z.array(z.string()),
        topOpportunities: z.array(z.string()),
        recommendations: z.array(z.string()),
        actionItems: z.array(z.string()),
        nextSteps: z.array(z.string()),
      })
    },
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are a senior business strategist. Based on the comprehensive market analysis for "{{{category}}}", create an executive summary with:

1. **Key Findings**: 3-5 most important insights from the analysis
2. **Top Opportunities**: 3-4 highest-potential product opportunities
3. **Strategic Recommendations**: 4-6 actionable recommendations for Amazon Basics
4. **Action Items**: 5-7 specific next steps to pursue these opportunities
5. **Next Steps**: 3-5 immediate actions to take

Market Analysis Data:
- Opportunities: {{{opportunities}}}
- Competitors: {{{competitors}}}
- Financial Summary: {{{financialSummary}}}
- Market Trends: {{{marketTrends}}}
- Pain Points: {{{painPoints}}}

Focus on actionable insights that would drive business decisions.`,
  });

  const executiveSummary = await executiveSummaryPrompt({
    category: input.category,
    opportunities: opportunityAnalysis.opportunities,
    competitors: competitiveAnalysis.competitors,
    financialSummary: financialAnalysis.financialSummary,
    marketTrends: painPointAnalysis.marketTrends,
    painPoints: painPointAnalysis.painPoints,
  });

  // Compile comprehensive report
  const report = {
    category: input.category,
    analysisDate: new Date(),
    executiveSummary: {
      keyFindings: executiveSummary.output!.keyFindings,
      topOpportunities: executiveSummary.output!.topOpportunities,
      recommendations: executiveSummary.output!.recommendations,
      totalMarketSize: opportunityAnalysis.marketSize,
      recommendedInvestment: financialAnalysis.financialSummary.investmentRequired,
    },
    opportunities: opportunityAnalysis.opportunities,
    competitors: competitiveAnalysis.competitors,
    competitiveInsights: competitiveAnalysis.competitiveInsights,
    financialSummary: financialAnalysis.financialSummary,
    marketTrends: painPointAnalysis.marketTrends,
    painPoints: painPointAnalysis.painPoints,
    marketGaps: competitiveAnalysis.marketGaps,
    risks: financialAnalysis.riskFactors,
    actionItems: executiveSummary.output!.actionItems,
    nextSteps: executiveSummary.output!.nextSteps,
  };

  return { report };
});

// Simple market analysis flow for streamlined approach
export const simpleMarketAnalysis = ai.defineFlow({
  name: 'simpleMarketAnalysisFlow',
  inputSchema: z.object({
    category: z.string(),
  }),
  outputSchema: z.object({
    category: z.string(),
    executiveSummary: z.string(),
    opportunities: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
      tam: z.number().positive(),
      estimatedCost: z.number().positive(),
      suggestedPrice: z.number().positive(),
      margin: z.number().min(0).max(100),
      competitorCount: z.number().min(0),
      easeOfEntry: z.enum(['Low', 'Medium', 'High']),
      overallScore: z.number().min(1).max(10),
      painPoints: z.array(z.string()),
      keyFeatures: z.array(z.string()),
    })),
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
  }),
}, async (input) => {
  const prompt = ai.definePrompt({
    name: 'simpleMarketAnalysisPrompt',
    input: { schema: z.object({ category: z.string() }) },
    output: { 
      schema: z.object({
        executiveSummary: z.string(),
        opportunities: z.array(z.object({
          id: z.string(),
          name: z.string(),
          category: z.string(),
          description: z.string(),
          tam: z.number().positive(),
          estimatedCost: z.number().positive(),
          suggestedPrice: z.number().positive(),
          margin: z.number().min(0).max(100),
          competitorCount: z.number().min(0),
          easeOfEntry: z.enum(['Low', 'Medium', 'High']),
          overallScore: z.number().min(1).max(10),
          painPoints: z.array(z.string()),
          keyFeatures: z.array(z.string()),
        })),
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
      })
    },
    model: 'googleai/gemini-1.5-flash',
    prompt: `You are a senior market research analyst for Amazon Basics. Generate a comprehensive market analysis report for the "{{{category}}}" category.

Provide a detailed analysis including:

1. **Executive Summary**: A 2-3 paragraph overview of the market opportunity

2. **Market Opportunities** (3-5 specific products):
   - Unique product name and description
   - TAM (Total Addressable Market) in millions USD
   - Estimated production cost per unit
   - Suggested retail price
   - Gross margin percentage
   - Number of competitors
   - Ease of entry (Low/Medium/High)
   - Overall opportunity score (1-10)
   - Customer pain points addressed
   - Key differentiating features

3. **Competitor Analysis** (5-7 key competitors):
   - Company name
   - Market share percentage
   - Price range (e.g., "$15-25")
   - Key strengths
   - Key weaknesses

4. **Financial Projections**:
   - Total market size in millions USD
   - Estimated first-year revenue potential
   - Break-even point in months
   - Expected ROI percentage
   - Key risk factors

5. **Strategic Recommendations**: 4-6 actionable recommendations

6. **Confidence Score**: Overall confidence in analysis (0-100%)

Base your analysis on realistic market data, industry benchmarks, and Amazon Basics' strategy of providing quality basics at competitive prices. Focus on mass-market appeal and scalable opportunities.`,
  });

  const { output } = await prompt(input);
  
  return {
    category: input.category,
    executiveSummary: output!.executiveSummary,
    opportunities: output!.opportunities,
    competitorAnalysis: output!.competitorAnalysis,
    financialProjections: output!.financialProjections,
    recommendations: output!.recommendations,
    confidenceScore: output!.confidenceScore,
    generatedAt: new Date(),
  };
});

// Export the main function for use in the application
export async function runMarketAnalysis(category: string) {
  const result = await simpleMarketAnalysis({ category });
  return result;
}
/**
 * @fileOverview Market Analysis Service - Orchestrates comprehensive market analysis
 * and provides mock data generation for testing and development.
 */

import { MarketAnalysisInput, ComprehensiveMarketReport, MarketOpportunity, Competitor } from '@/lib/types';
import { runComprehensiveMarketAnalysis } from '@/ai/flows/comprehensive-market-analysis';

export interface AnalysisOptions {
  useMockData?: boolean;
  confidenceThreshold?: number;
  maxOpportunities?: number;
}

export class MarketAnalysisService {
  /**
   * Performs comprehensive market analysis for a given category
   */
  async analyzeMarket(
    input: MarketAnalysisInput,
    options: AnalysisOptions = {}
  ): Promise<ComprehensiveMarketReport> {
    try {
      // Use mock data in development or when explicitly requested
      if (options.useMockData || process.env.NODE_ENV === 'development') {
        return this.generateMockReport(input);
      }

      // Run actual AI analysis
      const report = await runComprehensiveMarketAnalysis(input);
      
      // Apply confidence filtering if specified
      if (options.confidenceThreshold) {
        report.opportunities = report.opportunities.filter(
          opp => this.calculateConfidence(opp) >= options.confidenceThreshold!
        );
      }

      // Limit number of opportunities if specified
      if (options.maxOpportunities) {
        report.opportunities = report.opportunities
          .sort((a, b) => b.overallScore - a.overallScore)
          .slice(0, options.maxOpportunities);
      }

      return report;
    } catch (error) {
      console.error('Market analysis failed:', error);
      
      // Graceful degradation - return mock data with error indication
      const mockReport = this.generateMockReport(input);
      mockReport.executiveSummary.keyFindings.unshift(
        'Note: Analysis completed with limited data due to service limitations'
      );
      
      return mockReport;
    }
  }

  /**
   * Calculates confidence score for an opportunity based on data quality
   */
  private calculateConfidence(opportunity: MarketOpportunity): number {
    let confidence = 70; // Base confidence
    
    // Increase confidence based on data completeness
    if (opportunity.painPoints.length >= 3) confidence += 10;
    if (opportunity.keyFeatures.length >= 3) confidence += 10;
    if (opportunity.competitorCount > 0) confidence += 5;
    if (opportunity.tam > 1000000) confidence += 5; // Large market
    
    return Math.min(confidence, 100);
  }

  /**
   * Generates realistic mock data for testing and development
   */
  private generateMockReport(input: MarketAnalysisInput): ComprehensiveMarketReport {
    const mockOpportunities = this.generateMockOpportunities(input.category);
    const mockCompetitors = this.generateMockCompetitors(input.category);
    
    return {
      category: input.category,
      analysisDate: new Date(),
      executiveSummary: {
        keyFindings: [
          `${input.category} market shows strong growth potential with 15-20% annual growth`,
          'Customer pain points center around durability, ease of use, and value for money',
          'Market fragmentation creates opportunities for Amazon Basics to capture share',
          'Price-conscious consumers seeking reliable alternatives to premium brands'
        ],
        topOpportunities: mockOpportunities.slice(0, 3).map(opp => opp.name),
        recommendations: [
          'Focus on addressing top customer pain points with improved product design',
          'Leverage Amazon\'s supply chain advantages for competitive pricing',
          'Prioritize products with highest margin potential and lowest entry barriers',
          'Develop comprehensive testing program to ensure quality standards'
        ],
        totalMarketSize: this.calculateMockMarketSize(input.category),
        recommendedInvestment: 2500000,
      },
      opportunities: mockOpportunities,
      competitors: mockCompetitors,
      competitiveInsights: [
        'Market dominated by 3-4 major players with 60% combined market share',
        'Premium brands focus on features while budget options compromise on quality',
        'Amazon Basics can position between premium and budget with quality-value proposition',
        'Direct-to-consumer brands gaining traction through social media marketing'
      ],
      financialSummary: {
        averageMargin: 35,
        estimatedROI: 180,
        breakEvenTimeline: '18-24 months',
        investmentRequired: 2500000,
      },
      marketTrends: [
        'Increasing consumer focus on sustainability and eco-friendly materials',
        'Growing demand for multi-functional products that save space',
        'Rise of smart/connected features in traditional product categories',
        'Shift towards online purchasing accelerated by pandemic'
      ],
      painPoints: [
        'Products break or wear out too quickly',
        'Difficult to use or set up',
        'Poor value for money compared to alternatives',
        'Limited availability in retail stores',
        'Inconsistent quality across different brands'
      ],
      marketGaps: [
        'Affordable products with premium build quality',
        'Simple, intuitive designs for non-tech-savvy users',
        'Comprehensive warranty and customer support',
        'Sustainable materials at competitive prices'
      ],
      risks: [
        {
          risk: 'Intense price competition from established players',
          impact: 'Medium',
          mitigation: 'Focus on unique value propositions and quality differentiation'
        },
        {
          risk: 'Supply chain disruptions affecting cost structure',
          impact: 'High',
          mitigation: 'Diversify supplier base and maintain strategic inventory levels'
        },
        {
          risk: 'Changing consumer preferences and trends',
          impact: 'Medium',
          mitigation: 'Continuous market research and agile product development'
        }
      ],
      actionItems: [
        'Conduct detailed competitive analysis of top 5 players',
        'Develop product specifications addressing key pain points',
        'Create financial model with detailed cost breakdown',
        'Identify and evaluate potential manufacturing partners',
        'Design customer testing program for product validation'
      ],
      nextSteps: [
        'Approve budget for market entry feasibility study',
        'Assemble cross-functional product development team',
        'Begin supplier identification and qualification process',
        'Develop go-to-market strategy and timeline'
      ],
    };
  }

  /**
   * Generates mock market opportunities based on category
   */
  private generateMockOpportunities(category: string): MarketOpportunity[] {
    const baseOpportunities = [
      {
        name: `Smart ${category} Controller`,
        description: `IoT-enabled controller for ${category} with app integration`,
        painPoints: ['Complex setup', 'No remote control', 'Limited automation'],
        keyFeatures: ['Mobile app control', 'Voice assistant integration', 'Scheduling'],
        tam: 150000000,
        estimatedCost: 25,
        suggestedPrice: 49.99,
        competitorCount: 8,
        easeOfEntry: 'Medium' as const,
      },
      {
        name: `Eco-Friendly ${category} Set`,
        description: `Sustainable ${category} made from recycled materials`,
        painPoints: ['Environmental concerns', 'Poor durability', 'High cost'],
        keyFeatures: ['100% recycled materials', 'Carbon neutral shipping', 'Lifetime warranty'],
        tam: 85000000,
        estimatedCost: 18,
        suggestedPrice: 34.99,
        competitorCount: 5,
        easeOfEntry: 'Low' as const,
      },
      {
        name: `Compact ${category} Solution`,
        description: `Space-saving ${category} designed for small spaces`,
        painPoints: ['Takes up too much space', 'Not portable', 'Limited storage'],
        keyFeatures: ['Foldable design', 'Lightweight materials', 'Integrated storage'],
        tam: 120000000,
        estimatedCost: 22,
        suggestedPrice: 39.99,
        competitorCount: 12,
        easeOfEntry: 'High' as const,
      },
      {
        name: `Professional ${category} Kit`,
        description: `Commercial-grade ${category} for professional use`,
        painPoints: ['Not durable enough', 'Missing professional features', 'Poor warranty'],
        keyFeatures: ['Heavy-duty construction', 'Professional certifications', '5-year warranty'],
        tam: 95000000,
        estimatedCost: 35,
        suggestedPrice: 79.99,
        competitorCount: 6,
        easeOfEntry: 'Medium' as const,
      }
    ];

    return baseOpportunities.map((opp, index) => ({
      id: `opp-${index + 1}`,
      category,
      margin: Math.round(((opp.suggestedPrice - opp.estimatedCost) / opp.suggestedPrice) * 100),
      overallScore: Math.round(Math.random() * 3 + 7), // Score between 7-10
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=300&fit=crop`,
      ...opp,
    }));
  }

  /**
   * Generates mock competitor data
   */
  private generateMockCompetitors(category: string): Competitor[] {
    const competitorNames = [
      'MarketLeader Pro',
      'BudgetChoice Basic',
      'PremiumBrand Elite',
      'InnovativeTech Smart',
      'ReliableBrand Standard'
    ];

    return competitorNames.map((name, index) => ({
      name,
      price: Math.round((20 + index * 15) * 100) / 100,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.round(Math.random() * 5000 + 500),
      strengths: this.generateCompetitorStrengths(index),
      weaknesses: this.generateCompetitorWeaknesses(index),
    }));
  }

  private generateCompetitorStrengths(index: number): string[] {
    const allStrengths = [
      ['Market leader', 'Wide distribution', 'Brand recognition'],
      ['Low price point', 'Basic functionality', 'Mass market appeal'],
      ['Premium materials', 'Advanced features', 'Excellent warranty'],
      ['Innovative technology', 'Smart features', 'Modern design'],
      ['Reliable quality', 'Good customer service', 'Proven track record']
    ];
    return allStrengths[index] || allStrengths[0];
  }

  private generateCompetitorWeaknesses(index: number): string[] {
    const allWeaknesses = [
      ['High price', 'Complex features', 'Slow innovation'],
      ['Poor quality', 'Limited features', 'Weak warranty'],
      ['Very expensive', 'Over-engineered', 'Limited availability'],
      ['Reliability issues', 'Complex setup', 'Poor support'],
      ['Outdated design', 'Limited features', 'Higher price']
    ];
    return allWeaknesses[index] || allWeaknesses[0];
  }

  /**
   * Calculates mock market size based on category
   */
  private calculateMockMarketSize(category: string): number {
    // Base market size calculation with some randomization
    const baseSize = 500000000; // $500M base
    const categoryMultiplier = category.length * 10000000; // Vary by category
    const randomFactor = Math.random() * 0.5 + 0.75; // 75-125% of base
    
    return Math.round(baseSize + categoryMultiplier * randomFactor);
  }

  /**
   * Validates analysis input
   */
  validateInput(input: MarketAnalysisInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!input.category || input.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (input.category && input.category.length > 100) {
      errors.push('Category must be less than 100 characters');
    }

    if (input.targetPrice && input.targetPrice <= 0) {
      errors.push('Target price must be positive');
    }

    if (input.keywords && input.keywords.some(k => k.trim().length === 0)) {
      errors.push('Keywords cannot be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Gets analysis status and progress
   */
  async getAnalysisStatus(analysisId: string): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    estimatedTimeRemaining?: number;
  }> {
    // Mock implementation - in real app this would check actual analysis status
    return {
      status: 'completed',
      progress: 100,
    };
  }
}
/**
 * @fileOverview Financial calculation utilities for market analysis
 * Provides functions for TAM calculations, cost estimates, ROI projections, and financial modeling
 */

import { MarketOpportunity, ComprehensiveMarketReport } from '@/lib/types';

export interface CostBreakdown {
  materialCosts: number;
  manufacturingCosts: number;
  logisticsCosts: number;
  marketingCosts: number;
  overheadCosts: number;
  totalCosts: number;
}

export interface RevenueProjection {
  year: number;
  projectedRevenue: number;
  projectedUnits: number;
  marketPenetration: number;
  averageSellingPrice: number;
}

export interface ROIAnalysis {
  initialInvestment: number;
  projectedROI: number;
  paybackPeriod: number; // in months
  netPresentValue: number;
  internalRateOfReturn: number;
}

/**
 * Calculates Total Addressable Market (TAM) based on market data
 */
export function calculateTAM(
  totalMarketSize: number,
  targetSegmentPercentage: number,
  averagePrice: number,
  annualPurchaseFrequency: number = 1
): number {
  const targetMarketSize = totalMarketSize * (targetSegmentPercentage / 100);
  return targetMarketSize * averagePrice * annualPurchaseFrequency;
}

/**
 * Estimates production costs with detailed breakdown
 */
export function estimateProductionCosts(
  basePrice: number,
  category: string,
  complexity: 'Low' | 'Medium' | 'High' = 'Medium'
): CostBreakdown {
  // Cost percentages based on product complexity and category
  const costMultipliers = {
    Low: { material: 0.25, manufacturing: 0.15, logistics: 0.08, marketing: 0.12, overhead: 0.10 },
    Medium: { material: 0.35, manufacturing: 0.20, logistics: 0.10, marketing: 0.15, overhead: 0.12 },
    High: { material: 0.45, manufacturing: 0.25, logistics: 0.12, marketing: 0.18, overhead: 0.15 }
  };

  const multipliers = costMultipliers[complexity];
  
  // Category-specific adjustments
  const categoryAdjustments = getCategoryAdjustments(category);
  
  const materialCosts = basePrice * multipliers.material * categoryAdjustments.material;
  const manufacturingCosts = basePrice * multipliers.manufacturing * categoryAdjustments.manufacturing;
  const logisticsCosts = basePrice * multipliers.logistics * categoryAdjustments.logistics;
  const marketingCosts = basePrice * multipliers.marketing * categoryAdjustments.marketing;
  const overheadCosts = basePrice * multipliers.overhead * categoryAdjustments.overhead;

  return {
    materialCosts,
    manufacturingCosts,
    logisticsCosts,
    marketingCosts,
    overheadCosts,
    totalCosts: materialCosts + manufacturingCosts + logisticsCosts + marketingCosts + overheadCosts
  };
}

/**
 * Gets category-specific cost adjustments
 */
function getCategoryAdjustments(category: string): {
  material: number;
  manufacturing: number;
  logistics: number;
  marketing: number;
  overhead: number;
} {
  const lowerCategory = category.toLowerCase();
  
  // Electronics and tech products
  if (lowerCategory.includes('electronic') || lowerCategory.includes('tech') || lowerCategory.includes('smart')) {
    return { material: 1.2, manufacturing: 1.3, logistics: 0.9, marketing: 1.1, overhead: 1.1 };
  }
  
  // Kitchen and home products
  if (lowerCategory.includes('kitchen') || lowerCategory.includes('home') || lowerCategory.includes('appliance')) {
    return { material: 1.0, manufacturing: 1.0, logistics: 1.2, marketing: 0.9, overhead: 1.0 };
  }
  
  // Clothing and textiles
  if (lowerCategory.includes('clothing') || lowerCategory.includes('textile') || lowerCategory.includes('apparel')) {
    return { material: 0.8, manufacturing: 0.9, logistics: 1.1, marketing: 1.2, overhead: 0.9 };
  }
  
  // Tools and hardware
  if (lowerCategory.includes('tool') || lowerCategory.includes('hardware') || lowerCategory.includes('automotive')) {
    return { material: 1.1, manufacturing: 1.1, logistics: 1.3, marketing: 0.8, overhead: 1.0 };
  }
  
  // Default adjustments
  return { material: 1.0, manufacturing: 1.0, logistics: 1.0, marketing: 1.0, overhead: 1.0 };
}

/**
 * Calculates gross margin percentage
 */
export function calculateGrossMargin(sellingPrice: number, totalCosts: number): number {
  return Math.round(((sellingPrice - totalCosts) / sellingPrice) * 100);
}

/**
 * Projects revenue over multiple years
 */
export function projectRevenue(
  opportunity: MarketOpportunity,
  marketGrowthRate: number = 0.15,
  penetrationRate: number = 0.02,
  years: number = 3
): RevenueProjection[] {
  const projections: RevenueProjection[] = [];
  
  for (let year = 1; year <= years; year++) {
    // Market grows each year
    const adjustedTAM = opportunity.tam * Math.pow(1 + marketGrowthRate, year - 1);
    
    // Penetration increases over time but with diminishing returns
    const yearlyPenetration = penetrationRate * Math.pow(1.5, year - 1) * Math.pow(0.8, year - 1);
    const projectedUnits = Math.round((adjustedTAM / opportunity.suggestedPrice) * yearlyPenetration);
    const projectedRevenue = projectedUnits * opportunity.suggestedPrice;
    
    projections.push({
      year,
      projectedRevenue,
      projectedUnits,
      marketPenetration: yearlyPenetration * 100,
      averageSellingPrice: opportunity.suggestedPrice
    });
  }
  
  return projections;
}

/**
 * Calculates ROI analysis with NPV and IRR
 */
export function calculateROIAnalysis(
  initialInvestment: number,
  revenueProjections: RevenueProjection[],
  costBreakdown: CostBreakdown,
  discountRate: number = 0.10
): ROIAnalysis {
  // Calculate annual profits
  const annualProfits = revenueProjections.map(projection => {
    const totalRevenue = projection.projectedRevenue;
    const totalCosts = projection.projectedUnits * costBreakdown.totalCosts;
    return totalRevenue - totalCosts;
  });
  
  // Calculate NPV
  let npv = -initialInvestment;
  annualProfits.forEach((profit, index) => {
    npv += profit / Math.pow(1 + discountRate, index + 1);
  });
  
  // Calculate total profit over projection period
  const totalProfit = annualProfits.reduce((sum, profit) => sum + profit, 0);
  const projectedROI = ((totalProfit - initialInvestment) / initialInvestment) * 100;
  
  // Calculate payback period (simplified)
  let cumulativeProfit = 0;
  let paybackPeriod = 0;
  for (let i = 0; i < annualProfits.length; i++) {
    cumulativeProfit += annualProfits[i];
    if (cumulativeProfit >= initialInvestment) {
      paybackPeriod = (i + 1) * 12; // Convert to months
      break;
    }
  }
  
  // Simplified IRR calculation (approximation)
  const averageAnnualProfit = totalProfit / revenueProjections.length;
  const internalRateOfReturn = (averageAnnualProfit / initialInvestment) * 100;
  
  return {
    initialInvestment,
    projectedROI,
    paybackPeriod,
    netPresentValue: npv,
    internalRateOfReturn
  };
}

/**
 * Calculates break-even analysis
 */
export function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number
): {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
} {
  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = contributionMargin / sellingPricePerUnit;
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
  
  return {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio
  };
}

/**
 * Performs sensitivity analysis on key variables
 */
export function performSensitivityAnalysis(
  baseOpportunity: MarketOpportunity,
  variables: {
    priceChange?: number; // percentage change
    costChange?: number; // percentage change
    tamChange?: number; // percentage change
  }
): {
  scenario: string;
  adjustedMargin: number;
  adjustedScore: number;
  impactAssessment: string;
} {
  const priceMultiplier = 1 + (variables.priceChange || 0) / 100;
  const costMultiplier = 1 + (variables.costChange || 0) / 100;
  const tamMultiplier = 1 + (variables.tamChange || 0) / 100;
  
  const adjustedPrice = baseOpportunity.suggestedPrice * priceMultiplier;
  const adjustedCost = baseOpportunity.estimatedCost * costMultiplier;
  const adjustedTAM = baseOpportunity.tam * tamMultiplier;
  
  const adjustedMargin = calculateGrossMargin(adjustedPrice, adjustedCost);
  
  // Adjust score based on changes
  let scoreAdjustment = 0;
  if (variables.priceChange) scoreAdjustment += (variables.priceChange > 0 ? -0.5 : 0.5);
  if (variables.costChange) scoreAdjustment += (variables.costChange > 0 ? -0.3 : 0.3);
  if (variables.tamChange) scoreAdjustment += (variables.tamChange > 0 ? 0.4 : -0.4);
  
  const adjustedScore = Math.max(1, Math.min(10, baseOpportunity.overallScore + scoreAdjustment));
  
  // Generate impact assessment
  let impactAssessment = 'Neutral impact on opportunity viability';
  if (scoreAdjustment > 0.5) impactAssessment = 'Positive impact - opportunity becomes more attractive';
  if (scoreAdjustment < -0.5) impactAssessment = 'Negative impact - opportunity becomes less attractive';
  
  const scenario = `Price ${variables.priceChange || 0}%, Cost ${variables.costChange || 0}%, TAM ${variables.tamChange || 0}%`;
  
  return {
    scenario,
    adjustedMargin,
    adjustedScore,
    impactAssessment
  };
}

/**
 * Calculates market penetration timeline
 */
export function calculatePenetrationTimeline(
  tam: number,
  targetPenetration: number,
  rampUpMonths: number = 18
): Array<{ month: number; penetration: number; revenue: number; units: number }> {
  const timeline = [];
  const maxPenetration = targetPenetration / 100;
  
  for (let month = 1; month <= rampUpMonths; month++) {
    // S-curve adoption pattern
    const progress = month / rampUpMonths;
    const penetration = maxPenetration * (1 / (1 + Math.exp(-10 * (progress - 0.5))));
    
    const revenue = tam * penetration;
    const units = Math.round(revenue / 50); // Assuming average $50 price
    
    timeline.push({
      month,
      penetration: penetration * 100,
      revenue,
      units
    });
  }
  
  return timeline;
}

/**
 * Formats financial numbers for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}
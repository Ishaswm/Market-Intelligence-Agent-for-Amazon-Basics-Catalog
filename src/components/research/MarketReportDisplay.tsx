'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Download, DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { MarketAnalysisReport } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MarketReportDisplayProps {
  report: MarketAnalysisReport;
  onReset: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function MarketReportDisplay({ report, onReset }: MarketReportDisplayProps) {
  const downloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) pdf.setFont('helvetica', 'bold');
      else pdf.setFont('helvetica', 'normal');
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.35) > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.35 + 5;
    };

    // Add title
    addText(`Market Analysis Report: ${report.category}`, 18, true);
    addText(`Generated: ${report.generatedAt.toLocaleDateString()}`, 10);
    addText(`Confidence Score: ${report.confidenceScore}%`, 10);
    yPosition += 10;

    // Executive Summary
    addText('Executive Summary', 14, true);
    addText(report.executiveSummary, 10);
    yPosition += 10;

    // Key Metrics
    addText('Key Financial Metrics', 14, true);
    addText(`Market Size: $${(report.financialProjections.totalMarketSize / 1000000).toFixed(1)}B`, 10);
    addText(`Estimated Revenue: $${(report.financialProjections.estimatedRevenue / 1000000).toFixed(1)}M`, 10);
    addText(`ROI: ${report.financialProjections.roi}%`, 10);
    addText(`Break Even: ${report.financialProjections.breakEvenPoint} months`, 10);
    yPosition += 10;

    // Market Opportunities
    addText('Market Opportunities', 14, true);
    report.opportunities.forEach((opp, index) => {
      addText(`${index + 1}. ${opp.name}`, 12, true);
      addText(opp.description, 10);
      addText(`TAM: $${(opp.tam / 1000000).toFixed(1)}M | Cost: $${opp.estimatedCost} | Price: $${opp.suggestedPrice} | Margin: ${opp.margin}%`, 9);
      addText(`Score: ${opp.overallScore}/10 | Entry: ${opp.easeOfEntry} | Competitors: ${opp.competitorCount}`, 9);
      addText(`Pain Points: ${opp.painPoints.join(', ')}`, 9);
      yPosition += 5;
    });

    // Competitor Analysis
    addText('Competitive Landscape', 14, true);
    report.competitorAnalysis.forEach((comp, index) => {
      addText(`${index + 1}. ${comp.name} (${comp.marketShare}% market share)`, 12, true);
      addText(`Price Range: ${comp.priceRange}`, 10);
      addText(`Strengths: ${comp.strengths.join(', ')}`, 9);
      addText(`Weaknesses: ${comp.weaknesses.join(', ')}`, 9);
      yPosition += 5;
    });

    // Risk Factors
    addText('Risk Factors', 14, true);
    report.financialProjections.riskFactors.forEach((risk, index) => {
      addText(`• ${risk}`, 10);
    });
    yPosition += 10;

    // Recommendations
    addText('Strategic Recommendations', 14, true);
    report.recommendations.forEach((rec, index) => {
      addText(`${index + 1}. ${rec}`, 10);
    });

    // Save the PDF
    pdf.save(`${report.category.replace(/\s+/g, '-')}-market-analysis.pdf`);
  };

  // Prepare chart data
  const opportunityChartData = report.opportunities.map(opp => ({
    name: opp.name.substring(0, 20) + '...',
    score: opp.overallScore,
    tam: opp.tam / 1000000, // Convert to millions
  }));

  const competitorChartData = report.competitorAnalysis.map(comp => ({
    name: comp.name,
    marketShare: comp.marketShare,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Analysis Report</h1>
          <p className="text-muted-foreground">Category: {report.category}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <Button onClick={downloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div id="market-report" className="space-y-6 bg-white p-6 rounded-lg">
        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Executive Summary
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Confidence: {report.confidenceScore}%
              </Badge>
              <Badge variant="outline">
                Generated: {report.generatedAt.toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{report.executiveSummary}</p>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Market Size</p>
                  <p className="text-2xl font-bold">${(report.financialProjections.totalMarketSize / 1000000).toFixed(1)}B</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Est. Revenue</p>
                  <p className="text-2xl font-bold">${(report.financialProjections.estimatedRevenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">ROI</p>
                  <p className="text-2xl font-bold">{report.financialProjections.roi}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Break Even</p>
                  <p className="text-2xl font-bold">{report.financialProjections.breakEvenPoint}mo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Market Opportunities</CardTitle>
            <CardDescription>
              Top product opportunities identified in the {report.category} category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.opportunities.map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{opportunity.name}</h3>
                  <Badge variant={opportunity.easeOfEntry === 'Low' ? 'default' : 
                                 opportunity.easeOfEntry === 'Medium' ? 'secondary' : 'destructive'}>
                    {opportunity.easeOfEntry} Entry
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">TAM</p>
                    <p>${(opportunity.tam / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="font-medium">Est. Cost</p>
                    <p>${opportunity.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="font-medium">Suggested Price</p>
                    <p>${opportunity.suggestedPrice}</p>
                  </div>
                  <div>
                    <p className="font-medium">Margin</p>
                    <p>{opportunity.margin}%</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Opportunity Score</p>
                  <Progress value={opportunity.overallScore * 10} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{opportunity.overallScore}/10</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opportunity Scores Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={opportunityChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Competitor Market Share */}
          <Card>
            <CardHeader>
              <CardTitle>Competitor Market Share</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={competitorChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="marketShare"
                  >
                    {competitorChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Competitive Landscape</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.competitorAnalysis.map((competitor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{competitor.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{competitor.marketShare}% share</Badge>
                      <Badge variant="secondary">{competitor.priceRange}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-600 mb-1">Strengths</p>
                      <ul className="list-disc list-inside space-y-1">
                        {competitor.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-red-600 mb-1">Weaknesses</p>
                      <ul className="list-disc list-inside space-y-1">
                        {competitor.weaknesses.map((weakness, i) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Projections */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Key Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Market Size:</span>
                    <span className="font-medium">${(report.financialProjections.totalMarketSize / 1000000).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Revenue:</span>
                    <span className="font-medium">${(report.financialProjections.estimatedRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break Even Point:</span>
                    <span className="font-medium">{report.financialProjections.breakEvenPoint} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected ROI:</span>
                    <span className="font-medium">{report.financialProjections.roi}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Risk Factors</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {report.financialProjections.riskFactors.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
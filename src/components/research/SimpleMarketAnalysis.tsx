'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, Download } from 'lucide-react';
import { simpleMarketAnalysisAction } from '@/app/actions';
import { MarketAnalysisReport } from '@/lib/types';
import { MarketReportDisplay } from './MarketReportDisplay';

export function SimpleMarketAnalysis() {
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<MarketAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await simpleMarketAnalysisAction(category.trim());
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCategory('');
    setReport(null);
    setError(null);
  };

  if (report) {
    return <MarketReportDisplay report={report} onReset={handleReset} />;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Amazon Basics Market Scout</CardTitle>
        <CardDescription>
          Enter a product category to generate a comprehensive market analysis report with opportunities, competition insights, and financial projections.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Product Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., kitchen gadgets, home office accessories, fitness equipment"
              required
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button type="submit" disabled={isLoading || !category.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Market...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Generate Market Analysis
              </>
            )}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
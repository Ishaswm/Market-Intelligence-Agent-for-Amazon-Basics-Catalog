'use client'

import React from 'react';
import { useActionState } from 'react';
import { summarizeMarketAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Search, AlertCircle } from 'lucide-react';
import { ReportGenerator } from '../report/ReportGenerator';
import type { SummarizeMarketDataOutput } from '@/ai/flows/summarize-market-data';
import type { FindProductOpportunitiesOutput } from '@/ai/flows/find-product-opportunities';
import { Header } from '../common/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type ResearchState = FindProductOpportunitiesOutput & SummarizeMarketDataOutput & { error?: string };

const initialState: ResearchState = {
    productSuggestions: [],
    analysisSummary: '',
    marketTrends: '',
    customerPainPoints: '',
    error: undefined,
};

function OpportunityFinder({ onAnalysisComplete }: { onAnalysisComplete: (data: ResearchState) => void }) {
    const [state, formAction, isPending] = useActionState(summarizeMarketAction, initialState);

    React.useEffect(() => {
        if (!isPending && (state.productSuggestions?.length > 0 || state.error)) {
            onAnalysisComplete(state);
        }
    }, [state, isPending, onAnalysisComplete]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Step 1: Explore a Product Category</CardTitle>
                <CardDescription>
                    Enter a product category to analyze market trends and customer sentiment, and get new product ideas.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="productCategory">Product Category</Label>
                        <Input
                            id="productCategory"
                            name="productCategory"
                            placeholder="e.g., 'kitchen gadgets', 'home office accessories'"
                            required
                        />
                    </div>
                    {state?.error && !isPending && (
                        <Alert variant="destructive">
                             <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Analysis Failed</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                     <Button type="submit" disabled={isPending}>
                        {isPending ? 'Analyzing...' : <> <Search className="mr-2" /> Find Opportunities</>}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}


function OpportunityFinderSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Analyzing Market...</CardTitle>
                <CardDescription>
                    The AI is scouting the market for trends and customer pain points. This may take a moment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


function OpportunityResults({ opportunities, onSelectProduct, onReset }: {
    opportunities: FindProductOpportunitiesOutput,
    onSelectProduct: (productName: string) => void,
    onReset: () => void,
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Step 2: Choose a Product to Develop</CardTitle>
                <CardDescription>
                    Here are some AI-generated product ideas based on market analysis. Select one to generate a detailed business report.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="rounded-md border bg-muted/50 p-4">
                    <h3 className="font-semibold mb-2">AI Market Analysis Summary</h3>
                    <p className="text-sm text-muted-foreground">{opportunities.analysisSummary}</p>
                 </div>
                {opportunities.productSuggestions.map((product, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-md border p-4">
                        <div className="flex-shrink-0">
                            <Lightbulb className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <Button variant="link" className="p-0 h-auto mt-2" onClick={() => onSelectProduct(product.name)}>
                                Generate Report for this Product
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button variant="outline" onClick={onReset}>Start Over</Button>
            </CardFooter>
        </Card>
    )
}


export function ProductResearch() {
    const [step, setStep] = React.useState(1);
    const [researchData, setResearchData] = React.useState<ResearchState | null>(null);
    const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleAnalysisComplete = (data: ResearchState) => {
        setIsLoading(false);
        if (data.error) {
            // Error is handled by the OpportunityFinder component's alert
            return;
        }
        setResearchData(data);
        setStep(2);
    };

    const handleSelectProduct = (productName: string) => {
        setSelectedProduct(productName);
        setStep(3);
    };

    const handleReset = () => {
        setStep(1);
        setResearchData(null);
        setSelectedProduct(null);
        setIsLoading(false);
    }
    
    const downloadReport = async () => {
        const reportElement = document.getElementById('report-content');
        if (!reportElement) return;
        
        // Temporarily set a white background for capture if the user is in dark mode
        const originalBg = document.documentElement.style.backgroundColor;
        document.documentElement.style.backgroundColor = 'white';

        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true, 
            backgroundColor: '#ffffff', // Ensure canvas background is white
        });
        
        // Restore original background color
        document.documentElement.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${selectedProduct?.replace(/\s+/g, '-')}-business-report.pdf`);
    };

    const renderStep = () => {
        if (isLoading) {
            return <OpportunityFinderSkeleton />;
        }

        switch (step) {
            case 1:
                return <OpportunityFinder onAnalysisComplete={(data) => {
                    setIsLoading(true);
                    handleAnalysisComplete(data);
                }} />;
            case 2:
                if (researchData) {
                    return <OpportunityResults
                        opportunities={researchData}
                        onSelectProduct={handleSelectProduct}
                        onReset={handleReset}
                    />;
                }
                // If we are in step 2 but have no data, go back to step 1
                setStep(1);
                return <OpportunityFinder onAnalysisComplete={handleAnalysisComplete} />;

            case 3:
                 if (selectedProduct && researchData) {
                    return (
                        <>
                             <Header
                                title="Business Report"
                                description="Review the AI-generated report and download it as a PDF."
                                action={{ label: 'Download PDF', onClick: downloadReport }}
                            />
                            <ReportGenerator
                                productIdea={selectedProduct}
                                customerPainPoints={researchData.customerPainPoints}
                                marketTrends={researchData.marketTrends}
                            />
                             <div className="mt-8 text-center">
                                <Button variant="outline" onClick={handleReset}>Start a New Search</Button>
                            </div>
                        </>
                    )
                }
                // If we are in step 3 but something is missing, go back to step 1
                setStep(1);
                return <OpportunityFinder onAnalysisComplete={handleAnalysisComplete} />;

            default:
                 return <OpportunityFinder onAnalysisComplete={handleAnalysisComplete} />;
        }
    };


    return <>{renderStep()}</>
}

'use client'

import React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { findProductOpportunitiesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Search, Download } from 'lucide-react';
import { ReportGenerator } from '../report/ReportGenerator';
import type { FindProductOpportunitiesOutput } from '@/ai/flows/find-product-opportunities';
import { Header } from '../common/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


function OpportunityFinder({ onOpportunitiesFound }: { onOpportunitiesFound: (data: FindProductOpportunitiesOutput) => void }) {
    const [state, formAction] = useActionState(findProductOpportunitiesAction, {});
    
    React.useEffect(() => {
        if (state?.productSuggestions) {
            onOpportunitiesFound(state as FindProductOpportunitiesOutput);
        }
    }, [state, onOpportunitiesFound]);
    
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
                        />
                    </div>
                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analyzing...' : <> <Search className="mr-2" /> Find Opportunities</>}
        </Button>
    )
}

function OpportunityFinderSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Analyzing Market...</CardTitle>
                <CardDescription>
                    The AI is scouting the market for trends and customer pain points.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
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
    const [opportunityData, setOpportunityData] = React.useState<FindProductOpportunitiesOutput | null>(null);
    const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
    const [isLoadingOpportunities, setIsLoadingOpportunities] = React.useState(false);

    const handleOpportunitiesFound = (data: FindProductOpportunitiesOutput) => {
        setOpportunityData(data);
        setStep(2);
        setIsLoadingOpportunities(false);
    };

    const handleSelectProduct = (productName: string) => {
        setSelectedProduct(productName);
        setStep(3);
    };

    const handleReset = () => {
        setStep(1);
        setOpportunityData(null);
        setSelectedProduct(null);
        setIsLoadingOpportunities(false);
    }
    
    const downloadReport = async () => {
        const reportElement = document.getElementById('report-content');
        if (!reportElement) return;
        
        // Temporarily change background for capture
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'white';

        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true, 
            backgroundColor: '#ffffff', // Explicitly set a white background
        });
        
        // Restore original background
        document.body.style.backgroundColor = originalBg;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${selectedProduct?.replace(/\s+/g, '-')}-business-report.pdf`);
    };


    const renderStep = () => {
        // This is a workaround to show skeleton on form submission start
        const handleAction = (payload: FormData) => {
            setIsLoadingOpportunities(true);
            findProductOpportunitiesAction({}, payload).then(state => {
                 if (state?.productSuggestions) {
                    handleOpportunitiesFound(state as FindProductOpportunitiesOutput);
                } else {
                    // Handle error state if needed
                    setIsLoadingOpportunities(false);
                }
            });
        }

        if (isLoadingOpportunities && step === 1) {
            return <OpportunityFinderSkeleton />;
        }

        switch (step) {
            case 1:
                return <OpportunityFinder onOpportunitiesFound={handleOpportunitiesFound} />;
            case 2:
                if (opportunityData) {
                    return <OpportunityResults
                        opportunities={opportunityData}
                        onSelectProduct={handleSelectProduct}
                        onReset={handleReset}
                    />;
                }
                break; // Fallback to reset if data is missing
            case 3:
                 if (selectedProduct && opportunityData) {
                    return (
                        <>
                             <Header
                                title="Business Report"
                                description="Review the AI-generated report and download it as a PDF."
                                action={{ label: 'Download PDF', onClick: downloadReport }}
                            />
                            <ReportGenerator
                                productIdea={selectedProduct}
                                customerPainPoints={opportunityData.analysisSummary}
                                marketTrends={opportunityData.analysisSummary}
                            />
                        </>
                    )
                }
                break; // Fallback to reset if data is missing
        }
        
        // Fallback for inconsistent state
        handleReset();
        return <OpportunityFinder onOpportunitiesFound={handleOpportunitiesFound} />;
    };


    return <>{renderStep()}</>
}

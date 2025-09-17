'use client'

import React, { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { recommendProductsAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import { ReportGenerator } from '../report/ReportGenerator';

const initialRecommendState = {};

function RecommendSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Generating Ideas...' : 'Generate Product Ideas'}
        </Button>
    );
}

function LoadingSkeleton() {
    return (
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
    );
}

// Step 1: Form to get recommendations
function RecommendationForm({ onRecommendations, customerPainPoints, marketTrends }: { 
    onRecommendations: (data: any) => void,
    customerPainPoints: string,
    marketTrends: string
}) {
    const [state, formAction] = useActionState(recommendProductsAction, initialRecommendState);
    const { pending } = useFormStatus();

    React.useEffect(() => {
        if (state?.productSuggestions) {
            onRecommendations(state);
        }
    }, [state, onRecommendations]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Step 1: Analyze Market & Ideate</CardTitle>
                <CardDescription>
                    Provide summaries of customer pain points and market trends to generate tailored product recommendations.
                </CardDescription>
            </CardHeader>
            <form action={formAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerPainPoints">Customer Pain Points Summary</Label>
                        <Textarea
                            id="customerPainPoints"
                            name="customerPainPoints"
                            placeholder="e.g., 'Users complain about coffee mugs not keeping drinks hot long enough and being difficult to clean.'"
                            rows={5}
                            defaultValue={customerPainPoints}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="marketTrends">Market Trends Summary</Label>
                        <Textarea
                            id="marketTrends"
                            name="marketTrends"
                            placeholder="e.g., 'The market for smart home devices is growing, with a focus on convenience and app integration.'"
                            rows={5}
                            defaultValue={marketTrends}
                        />
                    </div>
                    {pending && <LoadingSkeleton />}
                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <RecommendSubmitButton />
                </CardFooter>
            </form>
        </Card>
    );
}

// Step 2: Display recommendations and allow selection
function RecommendationResults({ recommendations, onSelectProduct, onReset }: { 
    recommendations: { name: string; description: string }[],
    onSelectProduct: (name: string) => void,
    onReset: () => void,
 }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Step 2: Choose a Product to Develop</CardTitle>
                <CardDescription>
                    Based on your input, here are a few product ideas. Select one to generate a detailed business report.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recommendations.map((product, index) => (
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
    const [step, setStep] = useState(1);
    const [recommendationData, setRecommendationData] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const handleRecommendations = (data: any) => {
        setRecommendationData(data);
        setStep(2);
    };

    const handleSelectProduct = (productName: string) => {
        setSelectedProduct(productName);
        setStep(3);
    };
    
    const handleReset = () => {
        setStep(1);
        setRecommendationData(null);
        setSelectedProduct(null);
    }

    if (step === 1) {
        return <RecommendationForm 
            onRecommendations={handleRecommendations} 
            customerPainPoints={recommendationData?.customerPainPoints || ''}
            marketTrends={recommendationData?.marketTrends || ''}
        />;
    }

    if (step === 2 && recommendationData?.productSuggestions) {
        return <RecommendationResults 
            recommendations={recommendationData.productSuggestions} 
            onSelectProduct={handleSelectProduct}
            onReset={handleReset}
        />;
    }

    if (step === 3 && selectedProduct && recommendationData) {
        return <ReportGenerator 
            productIdea={selectedProduct} 
            customerPainPoints={recommendationData.customerPainPoints} 
            marketTrends={recommendationData.marketTrends} 
        />;
    }
    
    // Fallback to step 1 if state is inconsistent
    if (step !== 1) {
        handleReset();
    }

    return <RecommendationForm 
        onRecommendations={handleRecommendations} 
        customerPainPoints={recommendationData?.customerPainPoints || ''}
        marketTrends={recommendationData?.marketTrends || ''}
    />;
}

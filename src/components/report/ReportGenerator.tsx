'use client'

import React from 'react';
import { useActionState } from 'react'
import { generateReportAction } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReportDisplay } from './ReportDisplay'

const initialState = {}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
             <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
}

interface ReportGeneratorProps {
    productIdea: string;
    customerPainPoints: string;
    marketTrends: string;
}

export function ReportGenerator({ productIdea, customerPainPoints, marketTrends }: ReportGeneratorProps) {
  const [state, formAction] = useActionState(generateReportAction, initialState)
  
  const formRef = React.useRef<HTMLFormElement>(null);
  const hasSubmitted = React.useRef(false);

  React.useEffect(() => {
    // Automatically submit the form once when the component mounts with the pre-filled data.
    if (productIdea && customerPainPoints && marketTrends && !hasSubmitted.current) {
        const formData = new FormData();
        formData.append('productIdea', productIdea);
        formData.append('customerPainPoints', customerPainPoints);
        formData.append('marketTrends', marketTrends);
        formAction(formData);
        hasSubmitted.current = true;
    }
  }, [productIdea, customerPainPoints, marketTrends, formAction]);


  // Show loading skeleton immediately while waiting for the report
  if (!state?.report && !state?.error) {
    return (
        <Card className="border-none shadow-none">
            <CardHeader className='text-center'>
                <CardTitle className='font-headline text-3xl'>Generating Report...</CardTitle>
                <CardDescription>The AI is analyzing the data and compiling the report for <strong>{productIdea}</strong>.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoadingSkeleton />
            </CardContent>
        </Card>
    )
  }

  if (state?.report) {
    return <ReportDisplay report={state.report} productName={productIdea} />
  }
  
  // Render an empty state or an error if something went wrong
  return (
        <form ref={formRef} action={formAction} className="hidden">
             <input type="hidden" name="productIdea" defaultValue={productIdea} />
            <input type="hidden" name="customerPainPoints" defaultValue={customerPainPoints} />
            <input type="hidden" name="marketTrends" defaultValue={marketTrends} />
        </form>
  )
}

'use client'

import React from 'react';
import { useActionState } from 'react'
import { generateReportAction } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReportDisplay } from './ReportDisplay'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const initialState = {}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
             <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    )
}

interface ReportGeneratorProps {
    productIdea: string;
    marketAnalysisSummary: string;
}

export function ReportGenerator({ productIdea, marketAnalysisSummary }: ReportGeneratorProps) {
  const [state, formAction, isPending] = useActionState(generateReportAction, initialState)
  const formRef = React.useRef<HTMLFormElement>(null);
  
  React.useEffect(() => {
    // Automatically trigger the form submission when the component mounts with the required props.
    if (productIdea && marketAnalysisSummary) {
        // Only trigger the action if it hasn't already been started or completed.
        if (!state.report && !isPending && !state.error) {
           formRef.current?.requestSubmit();
        }
    }
  }, [productIdea, marketAnalysisSummary, state.report, isPending, state.error]);


  // Show loading skeleton while the report is being generated
  if (isPending || (!state?.report && !state?.error)) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className='text-center'>
                <CardTitle className='font-headline text-3xl'>Generating Report...</CardTitle>
                <CardDescription>The AI is analyzing the data and compiling the report for <strong>{productIdea}</strong>. This may take a moment.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form ref={formRef} action={formAction} className="hidden">
                    <input type="hidden" name="productIdea" value={productIdea} />
                    <input type="hidden" name="marketAnalysisSummary" value={marketAnalysisSummary} />
                </form>
                <LoadingSkeleton />
            </CardContent>
        </Card>
    )
  }

  // Display an error message if the action failed
  if (state?.error) {
     return (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Report Generation Failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
     )
  }

  // Display the generated report
  if (state?.report) {
    return <ReportDisplay report={state.report} productName={productIdea} />
  }
  
  // Fallback, should not be reached in normal flow
  return null;
}

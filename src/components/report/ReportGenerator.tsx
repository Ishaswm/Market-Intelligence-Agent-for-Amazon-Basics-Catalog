'use client'

import React from 'react';
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generateReportAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ReportDisplay } from './ReportDisplay'

const initialState = {}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Generating Report...' : 'Generate Report'}
        </Button>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
             <Skeleton className="h-10 w-1/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
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
  const { pending } = useFormStatus();
  
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    // Automatically submit the form when the component mounts with the pre-filled data.
    // This gives a seamless experience where the report generates automatically after the user selects a product idea.
    if (productIdea && customerPainPoints && marketTrends) {
        formRef.current?.requestSubmit();
    }
  }, [productIdea, customerPainPoints, marketTrends]);


  if (pending) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Generating Report...</CardTitle>
                <CardDescription>The AI is analyzing the data and compiling the report for <strong>{productIdea}</strong>.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoadingSkeleton />
            </CardContent>
        </Card>
    )
  }

  if (state?.report) {
    return <ReportDisplay report={state.report} />
  }

  return (
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Generate Business Report</CardTitle>
                <CardDescription>
                    Confirm the details below to generate a full business report for your selected product idea.
                </CardDescription>
            </CardHeader>
             <form action={formAction} ref={formRef}>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="productIdea">Product Idea</Label>
                        <Input id="productIdea" name="productIdea" defaultValue={productIdea} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customerPainPoints">Customer Pain Points</Label>
                        <Textarea id="customerPainPoints" name="customerPainPoints" defaultValue={customerPainPoints} rows={5}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="marketTrends">Market Trends</Label>
                        <Textarea id="marketTrends" name="marketTrends" defaultValue={marketTrends} rows={5}/>
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
  )
}

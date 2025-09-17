'use client'

import { useFormState, useFormStatus } from 'react-dom'
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

export function ReportGenerator() {
  const [state, formAction] = useFormState(generateReportAction, initialState)
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className='font-headline'>Report Inputs</CardTitle>
                <CardDescription>
                    Provide the necessary details to generate a product viability report.
                </CardDescription>
            </CardHeader>
             <form action={formAction}>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="productIdea">Product Idea</Label>
                        <Input id="productIdea" name="productIdea" placeholder="e.g., Smart Coffee Mug" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="customerPainPoints">Customer Pain Points</Label>
                        <Textarea id="customerPainPoints" name="customerPainPoints" placeholder="Summarize pain points from sentiment analysis..." rows={5}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="marketTrends">Market Trends</Label>
                        <Textarea id="marketTrends" name="marketTrends" placeholder="Summarize insights from trend identification..." rows={5}/>
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

        <div className="lg:col-span-2">
            {pending && (
                <Card>
                    <CardHeader>
                        <CardTitle className='font-headline'>Generating Report...</CardTitle>
                        <CardDescription>The AI is analyzing the data and compiling the report.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoadingSkeleton />
                    </CardContent>
                </Card>
            )}
            {!pending && state?.report && (
                <ReportDisplay report={state.report} />
            )}
             {!pending && !state?.report && (
                 <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">Your Report Awaits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Fill out the form on the left and click "Generate Report" to see the AI-powered business analysis.</p>
                    </CardContent>
                </Card>
             )}
        </div>
    </div>
  )
}

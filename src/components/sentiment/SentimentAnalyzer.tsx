'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { analyzeSentimentAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const initialState = {}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Analyzing...' : 'Analyze Sentiment'}
        </Button>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    )
}

export function SentimentAnalyzer() {
  const [state, formAction] = useFormState(analyzeSentimentAction, initialState)
  const { pending } = useFormStatus()

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className='font-headline'>Customer Sentiment Analysis</CardTitle>
        <CardDescription>
          Paste customer reviews of competitor products below to extract common pain points and unmet needs.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className='space-y-4'>
            <Textarea 
                name="reviews"
                placeholder="Paste product reviews here..."
                rows={10}
            />

            {pending && <LoadingSkeleton />}
            
            {!pending && state?.summary && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">Analysis Summary</h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground rounded-md border bg-secondary/50 p-4">
                        <p>{state.summary}</p>
                    </div>
                </div>
            )}
            
            {!pending && state?.error && (
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

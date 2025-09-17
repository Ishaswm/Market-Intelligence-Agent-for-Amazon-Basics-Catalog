'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { suggestTrendsAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const initialState = {}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Discovering...' : 'Discover Trends'}
        </Button>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
             <Skeleton className="h-8 w-1/4" />
             <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-40" />
             </div>
        </div>
    )
}

export function TrendSuggestion() {
  const [state, formAction] = useFormState(suggestTrendsAction, initialState)
  const { pending } = useFormStatus()

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className='font-headline'>AI-Powered Trend Discovery</CardTitle>
        <CardDescription>
          Click the button to analyze market data and identify trending product categories for Amazon Basics.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent>
            {pending && <LoadingSkeleton />}
            {!pending && state?.productCategories && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">Reasoning</h3>
                        <p className="text-muted-foreground">{state.reasoning}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">Suggested Categories</h3>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {state.productCategories.map((category) => (
                                <div key={category} className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                                    {category}
                                </div>
                            ))}
                        </div>
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

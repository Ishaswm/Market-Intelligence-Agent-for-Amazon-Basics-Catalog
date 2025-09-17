import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Opportunity } from '@/lib/types'

type OpportunityCardProps = {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src={opportunity.imageUrl}
          alt={opportunity.name}
          width={600}
          height={400}
          className="aspect-[3/2] w-full rounded-t-lg object-cover"
          data-ai-hint={opportunity.imageHint}
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="mb-2 font-headline">{opportunity.name}</CardTitle>
        <CardDescription>{opportunity.category}</CardDescription>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>TAM</span>
            <span className="font-semibold">${opportunity.tam}M</span>
          </div>
          <div className="flex justify-between">
            <span>Margin Potential</span>
            <span className="font-semibold">{opportunity.margin}%</span>
          </div>
          <div className="flex justify-between">
            <span>Ease of Entry</span>
             <span className="font-semibold">{opportunity.easeOfEntry}/100</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 px-6 pb-6">
        <div className="flex w-full items-center justify-between text-sm">
            <span className="font-semibold text-primary">Opportunity Score</span>
            <span className="font-bold text-lg">{opportunity.score}</span>
        </div>
        <Progress value={opportunity.score} aria-label={`Opportunity score: ${opportunity.score} out of 100`} />
      </CardFooter>
    </Card>
  )
}

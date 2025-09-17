import Image from 'next/image'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { opportunities } from '@/lib/data'
import { Progress } from '@/components/ui/progress'

export function OpportunitiesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Top 5 Opportunities</CardTitle>
        <CardDescription>Highest scoring potential products to launch.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="hidden md:table-cell">TAM (in millions)</TableHead>
              <TableHead className="hidden md:table-cell">Margin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.slice(0, 5).sort((a,b) => b.score - a.score).map((opp) => (
              <TableRow key={opp.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={opp.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={opp.imageUrl}
                    width="64"
                    data-ai-hint={opp.imageHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{opp.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{opp.score}</span>
                    <Progress value={opp.score} className="h-2 w-20" />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">${opp.tam}M</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{opp.margin}%</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

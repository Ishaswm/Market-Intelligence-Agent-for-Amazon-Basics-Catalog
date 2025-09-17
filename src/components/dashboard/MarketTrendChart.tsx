'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { marketTrendData, chartConfig } from '@/lib/data'

export function MarketTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-headline'>Market Trends</CardTitle>
        <CardDescription>Trending Product Categories - Last 12 Months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={marketTrendData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Smart Home" fill="var(--color-Smart Home)" radius={4} />
                <Bar dataKey="Wearables" fill="var(--color-Wearables)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

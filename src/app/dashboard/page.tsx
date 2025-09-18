import { Header } from '@/components/common/Header'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { MarketTrendChart } from '@/components/dashboard/MarketTrendChart'
import { BarChart3, DollarSign, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Your starting point for product discovery and analysis."
      />
      
       <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl font-semibold leading-none tracking-tight">Start New Product Research</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    This tool is a market intelligence engine designed to identify new product opportunities for the Amazon Basics catalog. 
                    It analyzes market trends and customer pain points to suggest high-potential products and generates detailed business viability reports.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard/opportunities">
                    <Button>
                        Go to Product Research
                        <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Addressable Market"
          value="$5.2B"
          icon={DollarSign}
          description="Across all tracked categories"
        />
        <KpiCard
          title="Data Points Analyzed"
          value="1.5M+"
          icon={Package}
          description="Customer reviews & market signals"
        />
        <KpiCard
          title="Top Growing Category"
          value="Smart Home"
          icon={BarChart3}
          description="+20.1% from last month"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8">
        <MarketTrendChart />
      </div>
    </>
  )
}

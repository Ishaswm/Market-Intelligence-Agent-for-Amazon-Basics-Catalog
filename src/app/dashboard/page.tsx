import { Header } from '@/components/common/Header'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { MarketTrendChart } from '@/components/dashboard/MarketTrendChart'
import { BarChart3, DollarSign, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Your starting point for product discovery and analysis."
      />
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
         <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-headline text-2xl font-semibold leading-none tracking-tight">Start New Product Research</h3>
                <p className="text-sm text-muted-foreground">Combine sentiment and trend analysis to generate product ideas and create a full business case.</p>
            </div>
            <div className="p-6 pt-0">
                <Link href="/dashboard/opportunities">
                    <Button>
                        Go to Product Research
                        <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </>
  )
}

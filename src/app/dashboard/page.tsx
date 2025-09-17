import { Header } from '@/components/common/Header'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { MarketTrendChart } from '@/components/dashboard/MarketTrendChart'
import { OpportunitiesTable } from '@/components/dashboard/OpportunitiesTable'
import { BarChart3, DollarSign, Package } from 'lucide-react'

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Welcome to your Market Intelligence Engine."
        action={{ label: 'Download Report' }}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Addressable Market"
          value="$5.2B"
          icon={DollarSign}
          description="Across all tracked categories"
        />
        <KpiCard
          title="Opportunities Tracked"
          value="125"
          icon={Package}
          description="Potential products analyzed"
        />
        <KpiCard
          title="Top Growing Category"
          value="Smart Home"
          icon={BarChart3}
          description="+20.1% from last month"
        />
      </div>
      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <MarketTrendChart />
        <OpportunitiesTable />
      </div>
    </>
  )
}

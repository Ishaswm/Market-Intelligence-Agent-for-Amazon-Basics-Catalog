import { Header } from "@/components/common/Header";
import { OpportunityCard } from "@/components/dashboard/OpportunityCard";
import { opportunities } from "@/lib/data";

export default function OpportunitiesPage() {
    const sortedOpportunities = [...opportunities].sort((a,b) => b.score - a.score);

    return (
        <>
            <Header
                title="Opportunity Scorecards"
                description="Browse potential product launch opportunities based on their market viability."
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedOpportunities.map(opp => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
            </div>
        </>
    )
}

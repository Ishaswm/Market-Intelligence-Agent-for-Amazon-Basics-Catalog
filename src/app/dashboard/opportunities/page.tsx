import { Header } from "@/components/common/Header";
import { ReportGeneratorWrapper } from "@/components/report/ReportGeneratorWrapper";

export default function ReportsPage() {
    return (
        <>
            <Header
                title="Product Opportunity Pipeline"
                description="Generate product ideas from market data and create a business report."
            />
            <ReportGeneratorWrapper />
        </>
    )
}

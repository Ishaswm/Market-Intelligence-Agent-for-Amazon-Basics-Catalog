import { Header } from "@/components/common/Header";
import { ReportGenerator } from "@/components/report/ReportGenerator";

export default function ReportsPage() {
    return (
        <>
            <Header
                title="Product Viability Report"
                description="Generate a comprehensive business report for a potential new product."
            />
            <ReportGenerator />
        </>
    )
}

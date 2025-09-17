import { Header } from "@/components/common/Header";
import { ProductResearch } from "@/components/research/ProductResearch";

export default function ReportsPage() {
    return (
        <>
            <Header
                title="Product Research"
                description="Generate product ideas from market data and create a comprehensive business report."
            />
            <ProductResearch />
        </>
    )
}

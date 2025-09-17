import { Header } from "@/components/common/Header";
import { ProductResearch } from "@/components/research/ProductResearch";

export default function ProductResearchPage() {
    return (
        <>
            <Header
                title="Product Research"
                description="Generate product ideas from a category and create a comprehensive business report."
            />
            <ProductResearch />
        </>
    )
}

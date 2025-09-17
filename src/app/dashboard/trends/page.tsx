import { Header } from "@/components/common/Header";
import { TrendSuggestion } from "@/components/trends/TrendSuggestion";

export default function TrendsPage() {
    return (
        <>
            <Header
                title="Trend Identification"
                description="Automatically identify trending product categories using Google Trends and e-commerce data."
            />
            <TrendSuggestion />
        </>
    )
}

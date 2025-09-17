import { Header } from "@/components/common/Header";
import { SentimentAnalyzer } from "@/components/sentiment/SentimentAnalyzer";

export default function SentimentPage() {
    return (
        <>
            <Header
                title="Customer Sentiment Analysis"
                description="Analyze customer reviews of competitor products to extract common pain points."
            />
            <SentimentAnalyzer />
        </>
    )
}

import type { GenerateBusinessReportOutput } from "@/ai/flows/generate-business-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Zap, TrendingUp } from "lucide-react";

interface ReportDisplayProps {
    report: GenerateBusinessReportOutput;
}

const ReportSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) => (
    <section>
        <div className="flex items-center gap-3 mb-3 border-b pb-2">
            <Icon className="h-6 w-6 text-primary" />
            <h2 className="font-headline text-xl font-semibold">{title}</h2>
        </div>
        <p className="text-muted-foreground">{content}</p>
    </section>
)

export function ReportDisplay({ report }: ReportDisplayProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Business Viability Report</CardTitle>
                <CardDescription>An AI-generated analysis of the product opportunity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ReportSection 
                        title="Financial Modeling"
                        content={report.financialModeling}
                        icon={DollarSign}
                    />
                    <ReportSection 
                        title="Opportunity Scoring"
                        content={report.opportunityScoring}
                        icon={Target}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <ReportSection 
                        title="Competitive Analysis"
                        content={report.competitiveAnalysis}
                        icon={Zap}
                    />
                    <ReportSection 
                        title="Market Trends"
                        content={report.marketTrends}
                        icon={TrendingUp}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

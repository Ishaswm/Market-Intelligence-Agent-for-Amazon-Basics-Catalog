import type { GenerateBusinessReportOutput } from "@/ai/flows/generate-business-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ReportDisplayProps {
    report: GenerateBusinessReportOutput;
}

export function ReportDisplay({ report }: ReportDisplayProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Business Viability Report</CardTitle>
                <CardDescription>An AI-generated analysis of the product opportunity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <section>
                    <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Executive Summary</h2>
                    <p className="text-muted-foreground">{report.executiveSummary}</p>
                </section>
                <section>
                    <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Target Audience</h2>
                    <p className="text-muted-foreground">{report.targetAudience}</p>
                </section>
                <section>
                    <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Feature Suggestions</h2>
                    <ul className="space-y-2">
                        {report.featureSuggestions.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section>
                        <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Marketing Strategy</h2>
                        <p className="text-muted-foreground">{report.marketingStrategy}</p>
                    </section>
                    <section>
                        <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Pricing Analysis</h2>
                        <p className="text-muted-foreground">{report.pricingAnalysis}</p>
                    </section>
                </div>
            </CardContent>
        </Card>
    );
}

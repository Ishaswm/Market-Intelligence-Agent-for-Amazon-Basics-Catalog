import type { GenerateBusinessReportOutput } from "@/ai/flows/generate-business-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Zap, TrendingUp, BadgeCheck, Clock, Shield, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ReportDisplayProps {
    report: GenerateBusinessReportOutput;
    productName: string;
}

const ReportSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) => (
    <div className="rounded-lg border bg-card/50 p-6">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-2xl font-semibold">{title}</h2>
        </div>
        <ul className="space-y-2 text-muted-foreground list-disc pl-5">
            {content.split('\n').map((line, index) => {
                const cleanedLine = line.replace(/^- /, '').trim();
                return cleanedLine && <li key={index}>{cleanedLine}</li>
            })}
        </ul>
    </div>
)

const OpportunityMetric = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) => (
    <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
)

export function ReportDisplay({ report, productName }: ReportDisplayProps) {
    const { opportunityScoring } = report;
    return (
        <div id="report-content">
            <Card className="border-none shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">Business Viability Report</CardTitle>
                    <CardDescription className="text-lg">An AI-generated analysis for: <span className="font-bold text-primary">{productName}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ReportSection 
                            title="Financial Modeling"
                            content={report.financialModeling}
                            icon={DollarSign}
                        />
                        <ReportSection 
                            title="Competitive Analysis"
                            content={report.competitiveAnalysis}
                            icon={Zap}
                        />
                    </div>
                    
                    <div className="rounded-lg border bg-card/50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="h-8 w-8 text-primary" />
                            <h2 className="font-headline text-2xl font-semibold">Opportunity Scoring</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                           <OpportunityMetric label="Time to Market" value={`${opportunityScoring.timeToMarketInMonths} Months`} icon={Clock} />
                           <OpportunityMetric label="Penetration Potential" value={opportunityScoring.penetrationPotential} icon={BarChart} />
                           <OpportunityMetric label="Ease of Entry" value={opportunityScoring.easeOfEntry} icon={Shield} />
                           <div className="flex items-center gap-3 col-span-2 md:col-span-1 justify-center bg-muted/50 p-4 rounded-md">
                                <div>
                                    <p className="text-sm text-muted-foreground text-center">Overall Score</p>
                                    <p className="font-bold text-4xl text-center text-primary">{opportunityScoring.scoreOutOfTen}/10</p>
                                </div>
                           </div>
                        </div>
                         <div className="space-y-2 mb-4">
                            <Progress value={opportunityScoring.scoreOutOfTen * 10} />
                            <p className="text-sm text-muted-foreground italic">{opportunityScoring.justification}</p>
                        </div>
                    </div>

                    <ReportSection 
                        title="Market Trends"
                        content={report.marketTrends}
                        icon={TrendingUp}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

import type { GenerateBusinessReportOutput } from "@/ai/flows/generate-business-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target, Zap, TrendingUp, Clock, Shield, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReportDisplayProps {
    report: GenerateBusinessReportOutput;
    productName: string;
}

const ReportSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) => (
    <Card className="flex-1">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
            <div className="p-2 bg-primary/10 rounded-md">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                {content.split('\n').map((line, index) => {
                    const cleanedLine = line.replace(/^- /, '').trim();
                    return cleanedLine && <li key={index}>{cleanedLine}</li>
                })}
            </ul>
        </CardContent>
    </Card>
)

const OpportunityMetric = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) => (
    <div className="flex items-center gap-3 rounded-lg border p-4 bg-card">
        <Icon className="h-8 w-8 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    </div>
)

export function ReportDisplay({ report, productName }: ReportDisplayProps) {
    const { opportunityScoring } = report;
    return (
        <div id="report-content" className="bg-background p-4 sm:p-8 rounded-lg">
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="text-center pb-8">
                    <CardTitle className="font-headline text-4xl">Business Viability Report</CardTitle>
                    <CardDescription className="text-lg">An AI-generated analysis for: <span className="font-bold text-primary">{productName}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="font-headline text-xl font-semibold">Opportunity Scoring</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                               <OpportunityMetric label="Time to Market" value={`${opportunityScoring.timeToMarketInMonths} Months`} icon={Clock} />
                               <OpportunityMetric label="Penetration Potential" value={opportunityScoring.penetrationPotential} icon={BarChart} />
                               <OpportunityMetric label="Ease of Entry" value={opportunityScoring.easeOfEntry} icon={Shield} />
                               <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 bg-primary/10 text-primary-foreground">
                                    <p className="text-sm text-primary/80">Overall Score</p>
                                    <p className="font-bold text-5xl text-primary">{opportunityScoring.scoreOutOfTen}<span className="text-2xl text-primary/80">/10</span></p>
                               </div>
                            </div>
                             <div className="space-y-2 pt-4">
                                <Progress value={opportunityScoring.scoreOutOfTen * 10} />
                                <p className="text-sm text-muted-foreground italic text-center pt-2">{opportunityScoring.justification}</p>
                            </div>
                        </CardContent>
                    </Card>

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

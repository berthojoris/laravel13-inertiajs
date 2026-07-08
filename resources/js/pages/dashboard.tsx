import { Head } from '@inertiajs/react';
import { Activity, ArrowUpRight, BarChart3, Download, PieChart as PieChartIcon, Sparkles, TrendingUp } from 'lucide-react';
import { BarChart, LineChart, PieChart, ScoreRadar } from '@/components/analytics-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { ChartItem, Metric, PieItem } from '@/types';

const metricIcons = [Activity, PieChartIcon, BarChart3, Download];
const metricAccents = [
    'from-blue-500/20 to-blue-500/5 text-blue-600 dark:text-blue-400',
    'from-teal-500/20 to-teal-500/5 text-teal-600 dark:text-teal-400',
    'from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400',
    'from-violet-500/20 to-violet-500/5 text-violet-600 dark:text-violet-400',
];

export default function Dashboard({
    metrics,
    monthlyResponses,
    satisfactionSplit,
    channelData,
    departmentScores,
}: {
    metrics: Metric[];
    monthlyResponses: number[];
    satisfactionSplit: PieItem[];
    channelData: ChartItem[];
    departmentScores: ChartItem[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 sm:p-6">
                <section className="relative overflow-hidden rounded-3xl border border-muted/80 bg-card/80 p-6 text-foreground shadow-sm backdrop-blur sm:p-8">
                    <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_46%)] dark:bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_46%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div className="max-w-3xl space-y-4">
                            <Badge variant="secondary" className="gap-2 bg-secondary text-secondary-foreground">
                                <Sparkles className="size-3.5 text-primary" />
                                Analytics overview
                            </Badge>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Survey intelligence dashboard
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Pantau tren kepuasan, performa channel, dan kualitas feedback dengan visualisasi yang lebih modern dan mudah dibaca.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-3 rounded-2xl border bg-secondary/45 p-4 backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-muted-foreground">Insight status</span>
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    Healthy
                                </Badge>
                            </div>
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-3xl font-semibold tracking-tight">86%</p>
                                    <p className="text-sm text-muted-foreground">completion rate</p>
                                </div>
                                <div className="rounded-full bg-background p-3 text-foreground shadow-sm">
                                    <TrendingUp className="size-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric, index) => {
                        const Icon = metricIcons[index] ?? Activity;

                        return (
                            <Card key={metric.label} className="overflow-hidden border-muted/80 bg-card/80 shadow-sm">
                                <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                                    <div className="space-y-1">
                                        <CardDescription>{metric.label}</CardDescription>
                                        <CardTitle className="text-3xl tracking-tight">{metric.value}</CardTitle>
                                    </div>
                                    <div className={`rounded-2xl bg-gradient-to-br p-3 ${metricAccents[index] ?? metricAccents[0]}`}>
                                        <Icon className="size-5" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <ArrowUpRight className="size-3.5" />
                                        {metric.trend} dari bulan lalu
                                    </span>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle>Monthly response trend</CardTitle>
                                    <CardDescription>Area line chart dengan kurva halus untuk memantau volume respons.</CardDescription>
                                </div>
                                <Badge variant="secondary">8 periods</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <LineChart data={monthlyResponses} />
                        </CardContent>
                    </Card>

                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Satisfaction split</CardTitle>
                            <CardDescription>Donut chart dengan legenda dan progress per segmen.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieChart data={satisfactionSplit} />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Channel performance</CardTitle>
                            <CardDescription>Vertical bar chart untuk membandingkan sumber input survey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={channelData} />
                        </CardContent>
                    </Card>

                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Department score radar</CardTitle>
                            <CardDescription>Radar chart untuk melihat sebaran skor kepuasan tiap departemen.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScoreRadar data={departmentScores} />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

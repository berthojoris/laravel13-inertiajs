import { Head } from '@inertiajs/react';
import { Activity, ArrowUpRight, BarChart3, Download, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, LineChart, PieChart, ScoreRadar } from '@/components/analytics-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { ChartItem, Metric, PieItem } from '@/types';

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
                <section className="overflow-hidden rounded-xl border bg-primary p-6 text-primary-foreground">
                    <div className="max-w-3xl space-y-3">
                        <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground">
                            Analytics overview
                        </Badge>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Survey intelligence dashboard
                            </h1>
                            <p className="max-w-2xl text-sm text-primary-foreground/80">
                                Pantau tren kepuasan, channel responden, dan kualitas feedback dalam satu tampilan analitik modern.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric, index) => (
                        <Card key={metric.label} className="gap-4">
                            <CardHeader className="flex-row items-start justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardDescription>{metric.label}</CardDescription>
                                    <CardTitle className="text-2xl">{metric.value}</CardTitle>
                                </div>
                                <div className="rounded-lg bg-secondary p-2 text-foreground">
                                    {index === 0 && <Activity className="size-4" />}
                                    {index === 1 && <PieChartIcon className="size-4" />}
                                    {index === 2 && <BarChart3 className="size-4" />}
                                    {index === 3 && <Download className="size-4" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    <ArrowUpRight className="size-4" />
                                    {metric.trend} dari bulan lalu
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly response trend</CardTitle>
                            <CardDescription>Line chart dummy untuk melihat volume respons per bulan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LineChart data={monthlyResponses} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Satisfaction split</CardTitle>
                            <CardDescription>Pie chart segmentasi kepuasan responden.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieChart data={satisfactionSplit} />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Channel performance</CardTitle>
                            <CardDescription>Bar chart sumber input survey.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart data={channelData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Department score</CardTitle>
                            <CardDescription>Perbandingan skor kepuasan per departemen.</CardDescription>
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

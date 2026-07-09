import { cn } from '@/lib/utils';

type PieItem = {
    label: string;
    value: number;
    color: string;
};

type ChartItem = {
    label: string;
    value: number;
};

function safeMax(values: number[]): number {
    return Math.max(...values, 1);
}

function getLinePath(points: { x: number; y: number }[]): string {
    if (points.length === 0) {
        return '';
    }

    return points.reduce((path, point, index) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const previous = points[index - 1];
        const controlX = (previous.x + point.x) / 2;

        return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
    }, '');
}

function polarPoint(center: number, radius: number, index: number, total: number): { x: number; y: number } {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;

    return {
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
    };
}

export function LineChart({ data }: { data: number[] }) {
    const width = 640;
    const height = 260;
    const padding = 34;
    const max = safeMax(data);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const points = data.map((value, index) => {
        const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
        const y = height - padding - ((value - min) / range) * (height - padding * 2);

        return { x, y, value };
    });
    const path = getLinePath(points);
    const area = `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
    const latest = data.at(-1) ?? 0;
    const previous = data.at(-2) ?? latest;
    const delta = latest - previous;

    return (
        <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-secondary/50 p-4 shadow-sm">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Latest responses</p>
                    <p className="text-2xl font-semibold tracking-tight">{latest}</p>
                </div>
                <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', delta >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')}>
                    {delta >= 0 ? '+' : ''}{delta} this period
                </span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
                <defs>
                    <linearGradient id="line-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="hsl(221 83% 53%)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="line-stroke" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                        <stop offset="100%" stopColor="hsl(173 80% 40%)" />
                    </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((line) => {
                    const y = padding + (line / 3) * (height - padding * 2);

                    return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} className="stroke-border" strokeDasharray="6 8" />;
                })}
                <path d={area} fill="url(#line-area)" />
                <path d={path} fill="none" stroke="url(#line-stroke)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
                {points.map((point, index) => (
                    <g key={`${point.x}-${point.value}`}>
                        <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 8 : 5} className="fill-background" stroke="hsl(221 83% 53%)" strokeWidth="4" />
                        {index === points.length - 1 && <circle cx={point.x} cy={point.y} r="16" className="fill-blue-500/10" />}
                    </g>
                ))}
            </svg>
        </div>
    );
}

export function PieChart({ data }: { data: PieItem[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
    const topSegment = [...data].sort((a, b) => b.value - a.value)[0];
    const segments = data.map((item, index) => {
        const previous = data
            .slice(0, index)
            .reduce((sum, segment) => sum + (segment.value / total) * 100, 0);
        const percentage = (item.value / total) * 100;

        return {
            ...item,
            percentage,
            offset: 25 - previous,
        };
    });

    return (
        <div className="grid gap-5 rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-4 shadow-sm md:grid-cols-[190px_1fr] md:items-center">
            <div className="relative mx-auto size-48">
                <svg viewBox="0 0 42 42" className="size-full -rotate-90">
                    <circle cx="21" cy="21" r="15.9" className="fill-transparent stroke-muted stroke-[5]" />
                    {segments.map((item) => (
                        <circle
                            key={item.label}
                            cx="21"
                            cy="21"
                            r="15.9"
                            className="fill-transparent stroke-[5] transition-opacity hover:opacity-80"
                            stroke={item.color}
                            strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                            strokeDashoffset={item.offset}
                            strokeLinecap="round"
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                        <p className="text-3xl font-semibold tracking-tight">{topSegment?.value ?? 0}%</p>
                        <p className="text-xs text-muted-foreground">top segment</p>
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.label} className="rounded-xl bg-secondary/40 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="flex items-center gap-2 font-medium">
                                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                {item.label}
                            </span>
                            <span className="text-muted-foreground">{item.value}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-background">
                            <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BarChart({ data, className }: { data: ChartItem[]; className?: string }) {
    const max = safeMax(data.map((item) => item.value));

    return (
        <div className={cn('rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-4 shadow-sm', className)}>
            <div className="flex h-72 items-end gap-3 sm:gap-4">
                {data.map((item, index) => {
                    const height = Math.max((item.value / max) * 100, 8);

                    return (
                        <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                            <div className="flex h-56 w-full items-end rounded-full bg-secondary/70 p-1">
                                <div
                                    className={cn(
                                        'w-full rounded-full bg-gradient-to-t shadow-sm transition-all',
                                        index === 0 && 'from-blue-600 to-blue-400',
                                        index === 1 && 'from-teal-600 to-teal-400',
                                        index === 2 && 'from-amber-600 to-amber-400',
                                        index === 3 && 'from-violet-600 to-violet-400',
                                    )}
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold">{item.value}</p>
                                <p className="truncate text-xs text-muted-foreground">{item.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function ScoreRadar({ data }: { data: ChartItem[] }) {
    const center = 150;
    const radius = 104;
    const rings = [0.25, 0.5, 0.75, 1];
    const maxScore = 5;
    const polygon = data
        .map((item, index) => {
            const point = polarPoint(center, (item.value / maxScore) * radius, index, data.length);

            return `${point.x},${point.y}`;
        })
        .join(' ');

    return (
        <div className="grid gap-6 rounded-2xl border bg-gradient-to-br from-background to-secondary/40 p-4 shadow-sm lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] lg:items-center">
            <svg viewBox="0 0 300 300" className="mx-auto size-64 sm:size-72">
                <defs>
                    <linearGradient id="radar-fill" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(221 83% 53%)" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="hsl(173 80% 40%)" stopOpacity="0.16" />
                    </linearGradient>
                </defs>
                {rings.map((ring) => (
                    <polygon
                        key={ring}
                        points={data.map((_, index) => {
                            const point = polarPoint(center, ring * radius, index, data.length);

                            return `${point.x},${point.y}`;
                        }).join(' ')}
                        className="fill-transparent stroke-border"
                    />
                ))}
                {data.map((_, index) => {
                    const point = polarPoint(center, radius, index, data.length);

                    return <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} className="stroke-border" />;
                })}
                <polygon points={polygon} fill="url(#radar-fill)" stroke="hsl(221 83% 53%)" strokeWidth="4" strokeLinejoin="round" />
                {data.map((item, index) => {
                    const point = polarPoint(center, (item.value / maxScore) * radius, index, data.length);

                    return <circle key={item.label} cx={point.x} cy={point.y} r="5" className="fill-background" stroke="hsl(221 83% 53%)" strokeWidth="4" />;
                })}
            </svg>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                {data.map((item) => (
                    <div key={item.label} className="min-w-0 rounded-xl bg-secondary/45 p-4">
                        <div className="flex min-w-0 items-baseline justify-between gap-3">
                            <p className="min-w-0 truncate font-medium">{item.label}</p>
                            <p className="shrink-0 text-2xl font-semibold tracking-tight">{item.value}</p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500" style={{ width: `${(item.value / maxScore) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

type ScoreListEntry = {
    label: string;
    value: number;
    suffix?: string;
};

export function ScoreList({ data, max = 5 }: { data: ScoreListEntry[]; max?: number }) {
    return (
        <div className="space-y-3">
            {data.map((item, index) => {
                const percent = Math.min((item.value / max) * 100, 100);

                return (
                    <div key={item.label} className="rounded-xl bg-secondary/40 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="flex items-center gap-2 font-medium">
                                <span className="grid size-6 place-items-center rounded-full bg-background text-xs font-semibold text-muted-foreground">
                                    {index + 1}
                                </span>
                                {item.label}
                            </span>
                            <span className="font-semibold tabular-nums">{item.value}{item.suffix}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-background">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

type HeatmapCell = {
    date: string;
    count: number;
};

function heatColor(intensity: number): string {
    if (intensity <= 0) {
        return 'bg-muted/60';
    }

    if (intensity < 0.25) {
        return 'bg-blue-500/25';
    }

    if (intensity < 0.5) {
        return 'bg-blue-500/45';
    }

    if (intensity < 0.75) {
        return 'bg-blue-600/70';
    }

    return 'bg-blue-700';
}

function formatShortDate(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);
    const day = parsed.toLocaleDateString('en-US', { day: '2-digit' });
    const month = parsed.toLocaleDateString('en-US', { month: 'short' });

    return `${day} ${month}`;
}

export function ActivityHeatmap({ data }: { data: HeatmapCell[] }) {
    const max = safeMax(data.map((cell) => cell.count));

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
                {data.map((cell) => {
                    const intensity = max > 0 ? cell.count / max : 0;

                    return (
                        <div key={cell.date} className="flex flex-col items-center gap-1.5">
                            <div
                                className={cn('aspect-square w-full rounded-lg', heatColor(intensity))}
                                title={`${formatShortDate(cell.date)}: ${cell.count} responses`}
                            />
                            <span className="text-[10px] leading-none text-muted-foreground">
                                {formatShortDate(cell.date).split(' ')[0]}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <span className="size-3 rounded bg-muted/60" />
                <span className="size-3 rounded bg-blue-500/45" />
                <span className="size-3 rounded bg-blue-600/70" />
                <span className="size-3 rounded bg-blue-700" />
                <span>More</span>
            </div>
        </div>
    );
}

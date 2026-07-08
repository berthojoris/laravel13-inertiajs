import { cn } from '@/lib/utils';

type PieItem = {
    label: string;
    value: number;
    color: string;
};

type BarItem = {
    label: string;
    value: number;
};

export function LineChart({ data }: { data: number[] }) {
    const width = 520;
    const height = 180;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 28) - 14;

        return { x, y, value };
    });
    const path = points
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');
    const area = `${path} L ${width} ${height} L 0 ${height} Z`;

    return (
        <div className="h-56 w-full overflow-hidden rounded-lg bg-secondary/40 p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <path d={area} className="fill-blue-500/10" />
                <path d={path} className="fill-none stroke-blue-600 stroke-[4]" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((point) => (
                    <circle key={`${point.x}-${point.value}`} cx={point.x} cy={point.y} r="5" className="fill-background stroke-blue-600 stroke-[3]" />
                ))}
            </svg>
        </div>
    );
}

export function PieChart({ data }: { data: PieItem[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const segments = data.map((item, index) => {
        const previous = data
            .slice(0, index)
            .reduce((sum, segment) => sum + (segment.value / total) * 100, 0);
        const percentage = (item.value / total) * 100;

        return {
            ...item,
            dashArray: `${percentage} ${100 - percentage}`,
            offset: 25 - previous,
        };
    });

    return (
        <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
            <svg viewBox="0 0 42 42" className="mx-auto size-44 -rotate-90">
                <circle cx="21" cy="21" r="15.9" className="fill-transparent stroke-muted stroke-[6]" />
                {segments.map((item) => (
                    <circle
                        key={item.label}
                        cx="21"
                        cy="21"
                        r="15.9"
                        className="fill-transparent stroke-[6]"
                        stroke={item.color}
                        strokeDasharray={item.dashArray}
                        strokeDashoffset={item.offset}
                    />
                ))}
            </svg>
            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.label}
                        </span>
                        <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BarChart({ data, className }: { data: BarItem[]; className?: string }) {
    const max = Math.max(...data.map((item) => item.value));

    return (
        <div className={cn('space-y-4', className)}>
            {data.map((item) => (
                <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / max) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ScoreRadar({ data }: { data: BarItem[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-5">
            {data.map((item) => (
                <div key={item.label} className="rounded-lg bg-secondary/50 p-4 text-center">
                    <div className="mx-auto mb-3 grid size-20 place-items-center rounded-full border-8 border-blue-500/20 bg-background">
                        <span className="text-lg font-semibold">{item.value}</span>
                    </div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">department score</p>
                </div>
            ))}
        </div>
    );
}

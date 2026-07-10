export type SurveyResponse = {
    id: number;
    respondent_name: string;
    email: string;
    department: string;
    satisfaction_score: number;
    channel: string;
    feedback: string | null;
    created_at: string | null;
};

export type SurveyExtraResponse = {
    id: number;
    user_name: string;
    user_email: string;
    answers: Record<string, string | string[]>;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

export type Metric = {
    label: string;
    value: string | number;
    trend: string;
};

export type PieItem = {
    label: string;
    value: number;
    color: string;
};

export type ChartItem = {
    label: string;
    value: number;
};

export type ScoreListEntry = {
    label: string;
    value: number;
    suffix?: string;
};

export type HeatmapCell = {
    date: string;
    count: number;
};

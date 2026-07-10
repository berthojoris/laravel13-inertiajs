import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Download,
    FileSpreadsheet,
    Info,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { exportMethod, index } from '@/routes/report';

const reportColumns = [
    'Date',
    'Name',
    'Email',
    'Department',
    'Score',
    'Channel',
    'Feedback',
];

const quickRanges = [
    { label: 'Hari ini', days: 0 },
    { label: '7 hari', days: 6 },
    { label: '30 hari', days: 29 },
];

function toDateInputValue(date: Date) {
    return date.toISOString().slice(0, 10);
}

function getPastDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return toDateInputValue(date);
}

function formatDateLabel(date: string) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

function getExportFilename(response: Response) {
    const disposition = response.headers.get('content-disposition');
    const filename = disposition?.match(/filename="?([^";]+)"?/i)?.[1];

    return filename ?? 'survey-report.xlsx';
}

export default function Report() {
    const today = toDateInputValue(new Date());
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [isExporting, setIsExporting] = useState(false);

    const isDateRangeValid = startDate <= endDate;
    const selectedDays = isDateRangeValid
        ? Math.floor(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                  86_400_000,
          ) + 1
        : 0;
    const exportUrl = exportMethod.url({
        query: { start_date: startDate, end_date: endDate },
    });

    async function handleExport() {
        if (!isDateRangeValid || isExporting) {
            return;
        }

        setIsExporting(true);

        try {
            const response = await fetch(exportUrl, {
                headers: { Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            });

            if (!response.ok) {
                throw new Error('Export failed.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = getExportFilename(response);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <>
            <Head title="Report" />

            <div className="space-y-6 p-4 sm:p-6">
                <section className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
                        <div className="flex max-w-3xl flex-col justify-between gap-8">
                            <div className="space-y-4">
                                <Badge
                                    variant="secondary"
                                    className="w-fit gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                >
                                    <FileSpreadsheet className="size-3.5" />
                                    Excel report builder
                                </Badge>
                                <div className="space-y-3">
                                    <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                        Export data survey tanpa ribet
                                    </h1>
                                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Tentukan periode, cek ringkasan export,
                                        lalu unduh file XLSX yang siap dibagikan
                                        ke tim.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {quickRanges.map((range) => (
                                    <Button
                                        key={range.label}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setStartDate(
                                                getPastDate(range.days),
                                            );
                                            setEndDate(today);
                                        }}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border bg-secondary/40 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Periode terpilih
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                                        {isDateRangeValid
                                            ? `${selectedDays} hari`
                                            : 'Tidak valid'}
                                    </p>
                                </div>
                                <div className="grid size-10 place-items-center rounded-lg bg-background text-emerald-600 dark:text-emerald-400">
                                    <CalendarDays className="size-5" />
                                </div>
                            </div>
                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Mulai
                                    </span>
                                    <span className="font-medium">
                                        {formatDateLabel(startDate)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">
                                        Akhir
                                    </span>
                                    <span className="font-medium">
                                        {formatDateLabel(endDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <CardTitle>Atur periode laporan</CardTitle>
                            <CardDescription>
                                Pilih rentang tanggal survey yang ingin
                                dimasukkan ke file Excel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        Tanggal mulai
                                    </Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        max={endDate}
                                        onChange={(event) =>
                                            setStartDate(event.target.value)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">
                                        Tanggal akhir
                                    </Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        min={startDate}
                                        max={today}
                                        onChange={(event) =>
                                            setEndDate(event.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {!isDateRangeValid && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                    Tanggal mulai tidak boleh melewati tanggal
                                    akhir.
                                </div>
                            )}

                            <div className="flex flex-col gap-3 rounded-xl border bg-secondary/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            File siap dibuat
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Export mengikuti filter tanggal dan
                                            format kolom standar survey.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    disabled={!isDateRangeValid || isExporting}
                                    aria-busy={isExporting}
                                    className="shrink-0"
                                    onClick={handleExport}
                                >
                                    {isExporting ? (
                                        <Spinner />
                                    ) : (
                                        <Download className="size-4" />
                                    )}
                                    {isExporting
                                        ? 'Membuat Excel...'
                                        : 'Generate Excel'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <aside className="space-y-4">
                        <Card className="border-muted/80 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Info className="size-4 text-muted-foreground" />
                                    Kolom export
                                </CardTitle>
                                <CardDescription>
                                    Struktur data yang akan muncul di file XLSX.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {reportColumns.map((column) => (
                                        <Badge
                                            key={column}
                                            variant="outline"
                                            className="bg-background"
                                        >
                                            {column}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-muted/80 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ShieldCheck className="size-4 text-muted-foreground" />
                                    Validasi laporan
                                </CardTitle>
                                <CardDescription>
                                    Export dibatasi oleh periode agar data tetap
                                    relevan dan mudah diaudit.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}

Report.layout = {
    breadcrumbs: [
        {
            title: 'Report',
            href: index(),
        },
    ],
};

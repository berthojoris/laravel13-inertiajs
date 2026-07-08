import { Head } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exportMethod, index } from '@/routes/report';

export default function Report() {
    const today = new Date().toISOString().slice(0, 10);
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const exportUrl = exportMethod.url({ query: { start_date: startDate, end_date: endDate } });

    return (
        <>
            <Head title="Report" />

            <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="mb-2 grid size-11 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <FileSpreadsheet className="size-5" />
                        </div>
                        <CardTitle>Generate report Excel</CardTitle>
                        <CardDescription>
                            Pilih periode data survey, lalu generate file XLSX menggunakan Laravel Excel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Tanggal mulai</Label>
                                <Input id="start_date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">Tanggal akhir</Label>
                                <Input id="end_date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-secondary/40 p-4 text-sm text-muted-foreground">
                            Export akan berisi kolom Date, Name, Email, Department, Score, Channel, dan Feedback sesuai periode yang dipilih.
                        </div>

                        <Button asChild>
                            <a href={exportUrl}>Generate Excel</a>
                        </Button>
                    </CardContent>
                </Card>
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

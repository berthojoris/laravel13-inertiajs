import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { index } from '@/routes/survey-extra-results';
import type { Paginated, SurveyExtraResponse } from '@/types';

const teamLabels: Record<string, string> = {
    sales: 'Sales',
    support: 'Support',
    operations: 'Operations',
    finance: 'Finance',
};

const priorityLabels: Record<string, string> = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak',
};

const frequencyLabels: Record<string, string> = {
    daily: 'Setiap hari',
    weekly: 'Setiap minggu',
    monthly: 'Setiap bulan',
    rarely: 'Jarang',
};

export default function SurveyExtraResults({
    responses,
    filters,
}: {
    responses: Paginated<SurveyExtraResponse>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isInitialRender = useRef(true);

    function runSearch(value: string) {
        router.get(
            index.url(),
            { search: value },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;

            return;
        }

        const timeout = setTimeout(() => runSearch(search), 3000);

        return () => clearTimeout(timeout);
         
    }, [search]);

    return (
        <>
            <Head title="Hasil Survey Extra" />

            <div className="space-y-6 p-4 sm:p-6">
                <Card>
                    <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Hasil Survey Extra</CardTitle>
                            <CardDescription>
                                Data hasil input dari menu Survey Extra dengan
                                search dan pagination.
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nama atau email user"
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead className="bg-secondary text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">
                                                Tanggal
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                User
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Tim
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Prioritas
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Frekuensi
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Nama Responden
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {responses.data.map((response) => (
                                            <tr
                                                key={response.id}
                                                className="bg-card transition-colors hover:bg-secondary/40"
                                            >
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {response.created_at}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium">
                                                        {response.user_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {response.user_email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="secondary">
                                                        {teamLabels[response.answers.q2 as string] ??
                                                            response.answers.q2 ??
                                                            '-'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="outline">
                                                        {priorityLabels[response.answers.q10 as string] ??
                                                            response.answers.q10 ??
                                                            '-'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {frequencyLabels[response.answers.q6 as string] ??
                                                        response.answers.q6 ??
                                                        '-'}
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {response.answers.q1 ?? '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {responses.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-10 text-center text-muted-foreground"
                                                >
                                                    Belum ada data survey extra
                                                    yang cocok.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {responses.from ?? 0}-
                                {responses.to ?? 0} dari {responses.total} data
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {responses.links.map((link) => (
                                    <Button
                                        key={`${link.label}-${link.url}`}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={Boolean(link.url)}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SurveyExtraResults.layout = {
    breadcrumbs: [
        {
            title: 'Hasil Survey Extra',
            href: index(),
        },
    ],
};

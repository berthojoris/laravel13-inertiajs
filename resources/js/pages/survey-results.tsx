import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/survey-results';
import type { Paginated, SurveyResponse } from '@/types';

export default function SurveyResults({
    responses,
    filters,
}: {
    responses: Paginated<SurveyResponse>;
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
            <Head title="Hasil Survey" />

            <div className="space-y-6 p-4 sm:p-6">
                <Card>
                    <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Hasil Survey</CardTitle>
                            <CardDescription>
                                Data hasil input dari menu Survey dengan search
                                dan pagination.
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nama, email, departemen"
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
                                                Responden
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Departemen
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Channel
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Skor
                                            </th>
                                            <th className="px-4 py-3 font-medium">
                                                Feedback
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
                                                        {
                                                            response.respondent_name
                                                        }
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {response.email}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {response.department}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="secondary">
                                                        {response.channel}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                        {
                                                            response.satisfaction_score
                                                        }
                                                    </span>
                                                </td>
                                                <td className="max-w-xs truncate px-4 py-4 text-muted-foreground">
                                                    {response.feedback ?? '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {responses.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-10 text-center text-muted-foreground"
                                                >
                                                    Belum ada data survey yang
                                                    cocok.
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
                            <PaginationLinks links={responses.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SurveyResults.layout = {
    breadcrumbs: [
        {
            title: 'Hasil Survey',
            href: index(),
        },
    ],
};

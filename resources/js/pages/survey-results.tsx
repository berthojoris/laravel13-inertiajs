import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { Archive, ArchiveRestore, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { archive, index } from '@/routes/survey-results';
import type { Paginated, SurveyResponse } from '@/types';

type SurveyResultsPageProps = {
    responses: Paginated<SurveyResponse>;
    filters: { search: string };
};

export default function SurveyResults({
    responses,
    filters,
}: SurveyResultsPageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [pendingId, setPendingId] = useState<number | null>(null);
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

    function toggleArchive(response: SurveyResponse) {
        const archived = !response.archived;

        // Optimistic update applies instantly; Inertia rolls back if the
        // request fails (e.g. non-owner gets 403 from the policy).
        router
            .optimistic((props: SurveyResultsPageProps) => ({
                responses: {
                    ...props.responses,
                    data: props.responses.data.map((item) =>
                        item.id === response.id ? { ...item, archived } : item,
                    ),
                },
            }))
            .put(
                archive.url({ response: response.id }),
                { archived },
                {
                    preserveScroll: true,
                    onFinish: () => setPendingId(null),
                },
            );

        setPendingId(response.id);
    }

    return (
        <>
            <Head title="Hasil Survey" />

            <div className="space-y-6 p-4 sm:p-6">
                <Card>
                    <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Hasil Survey</CardTitle>
                            <CardDescription>
                                Data hasil input dari menu Survey. Scroll ke
                                bawah untuk memuat data berikutnya secara
                                otomatis, arsipkan respons dengan tombol arsip.
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
                        <InfiniteScroll
                            data="responses"
                            preserveUrl
                            buffer={150}
                            loading={
                                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                                    <Spinner />
                                    Memuat data berikutnya…
                                </div>
                            }
                        >
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
                                                <th className="px-4 py-3 text-right font-medium">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {responses.data.map((response) => (
                                                <tr
                                                    key={response.id}
                                                    className={`bg-card transition-colors hover:bg-secondary/40 ${
                                                        response.archived
                                                            ? 'opacity-55'
                                                            : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-4 text-muted-foreground">
                                                        {response.created_at}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2 font-medium">
                                                            {
                                                                response.respondent_name
                                                            }
                                                            {response.archived && (
                                                                <Badge variant="secondary">
                                                                    Diarsipkan
                                                                </Badge>
                                                            )}
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
                                                        {response.feedback ??
                                                            '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleArchive(
                                                                    response,
                                                                )
                                                            }
                                                            disabled={
                                                                pendingId ===
                                                                response.id
                                                            }
                                                            aria-busy={
                                                                pendingId ===
                                                                response.id
                                                            }
                                                            aria-label={
                                                                response.archived
                                                                    ? `Pulihkan respons ${response.respondent_name}`
                                                                    : `Arsipkan respons ${response.respondent_name}`
                                                            }
                                                            title={
                                                                response.archived
                                                                    ? 'Pulihkan'
                                                                    : 'Arsipkan'
                                                            }
                                                            className="inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {pendingId ===
                                                            response.id ? (
                                                                <Spinner />
                                                            ) : response.archived ? (
                                                                <ArchiveRestore className="size-4" />
                                                            ) : (
                                                                <Archive className="size-4" />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {responses.data.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-4 py-10 text-center text-muted-foreground"
                                                    >
                                                        Belum ada data survey
                                                        yang cocok.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </InfiniteScroll>

                        <p className="mt-4 text-sm text-muted-foreground">
                            Menampilkan {responses.data.length} dari{' '}
                            {responses.total} data
                        </p>
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

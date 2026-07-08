import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index } from '@/routes/survey-results';

type SurveyResponse = {
    id: number;
    respondent_name: string;
    email: string;
    department: string;
    satisfaction_score: number;
    channel: string;
    feedback: string | null;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedResponses = {
    data: SurveyResponse[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

export default function SurveyResults({
    responses,
    filters,
}: {
    responses: PaginatedResponses;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search ?? '');

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(index.url(), { search }, { preserveState: true, preserveScroll: true });
    }

    return (
        <>
            <Head title="Hasil Survey" />

            <div className="space-y-6 p-4 sm:p-6">
                <Card>
                    <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Hasil Survey</CardTitle>
                            <CardDescription>Data hasil input dari menu Survey dengan search dan pagination.</CardDescription>
                        </div>
                        <form onSubmit={submit} className="flex w-full gap-2 md:w-sm">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama, email, departemen" className="pl-9" />
                            </div>
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-lg border">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-sm">
                                    <thead className="bg-secondary text-left text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Tanggal</th>
                                            <th className="px-4 py-3 font-medium">Responden</th>
                                            <th className="px-4 py-3 font-medium">Departemen</th>
                                            <th className="px-4 py-3 font-medium">Channel</th>
                                            <th className="px-4 py-3 font-medium">Skor</th>
                                            <th className="px-4 py-3 font-medium">Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {responses.data.map((response) => (
                                            <tr key={response.id} className="bg-card transition-colors hover:bg-secondary/40">
                                                <td className="px-4 py-4 text-muted-foreground">{response.created_at}</td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium">{response.respondent_name}</div>
                                                    <div className="text-xs text-muted-foreground">{response.email}</div>
                                                </td>
                                                <td className="px-4 py-4">{response.department}</td>
                                                <td className="px-4 py-4"><Badge variant="secondary">{response.channel}</Badge></td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                                        {response.satisfaction_score}
                                                    </span>
                                                </td>
                                                <td className="max-w-xs truncate px-4 py-4 text-muted-foreground">{response.feedback ?? '-'}</td>
                                            </tr>
                                        ))}
                                        {responses.data.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                                                    Belum ada data survey yang cocok.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {responses.from ?? 0}-{responses.to ?? 0} dari {responses.total} data
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {responses.links.map((link) => (
                                    <Button key={`${link.label}-${link.url}`} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} asChild={Boolean(link.url)}>
                                        {link.url ? <Link href={link.url} preserveScroll dangerouslySetInnerHTML={{ __html: link.label }} /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
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

SurveyResults.layout = {
    breadcrumbs: [
        {
            title: 'Hasil Survey',
            href: index(),
        },
    ],
};

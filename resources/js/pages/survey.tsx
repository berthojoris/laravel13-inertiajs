import { Form, Head } from '@inertiajs/react';
import {
    BarChart3,
    CheckCircle2,
    ClipboardList,
    Mail,
    MessageSquareText,
    Send,
    Sparkles,
    Star,
    UserRound,
} from 'lucide-react';
import InputError from '@/components/input-error';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CHANNELS, DEPARTMENTS } from '@/lib/survey';
import { create, store } from '@/routes/survey';

const scoreGuides = [
    { score: '1', label: 'Sangat tidak puas' },
    { score: '3', label: 'Netral' },
    { score: '5', label: 'Sangat puas' },
];

const captureSteps = [
    'Profil responden',
    'Konteks departemen',
    'Skor dan feedback',
];

export default function Survey() {
    return (
        <>
            <Head title="Survey" />

            <div className="space-y-6 p-4 sm:p-6">
                <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
                        <div className="max-w-3xl space-y-4">
                            <Badge
                                variant="secondary"
                                className="w-fit gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            >
                                <ClipboardList className="size-3.5" />
                                Survey input desk
                            </Badge>
                            <div className="space-y-3">
                                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                    Tangkap feedback responden dengan alur yang
                                    jelas
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Form ini dibuat untuk input cepat,
                                    konsisten, dan siap dipakai di dashboard
                                    analytics serta report Excel.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-secondary/40 p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Status data
                                    </p>
                                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                                        Siap dianalisis
                                    </p>
                                </div>
                                <div className="grid size-10 place-items-center rounded-lg bg-background text-emerald-600 dark:text-emerald-400">
                                    <BarChart3 className="size-5" />
                                </div>
                            </div>
                            <div className="mt-5 grid gap-2">
                                {captureSteps.map((step) => (
                                    <div
                                        key={step}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
                    <Card className="border-muted/80 shadow-sm">
                        <CardHeader>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <CardTitle>Form responden</CardTitle>
                                    <CardDescription>
                                        Isi detail survey dengan format yang
                                        rapi agar data mudah dibaca kembali.
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="w-fit bg-background"
                                >
                                    <Sparkles className="size-3" />
                                    Live capture
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...store.form()}
                                resetOnSuccess
                                className="grid gap-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="respondent_name">
                                                Nama responden
                                            </Label>
                                            <div className="relative">
                                                <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="respondent_name"
                                                    name="respondent_name"
                                                    placeholder="Contoh: Budi Santoso"
                                                    className="pl-9"
                                                    required
                                                />
                                            </div>
                                            <InputError
                                                message={errors.respondent_name}
                                            />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        placeholder="nama@email.com"
                                                        className="pl-9"
                                                        required
                                                    />
                                                </div>
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="satisfaction_score">
                                                    Skor kepuasan
                                                </Label>
                                                <div className="relative">
                                                    <Star className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-amber-500" />
                                                    <Input
                                                        id="satisfaction_score"
                                                        type="number"
                                                        name="satisfaction_score"
                                                        min="1"
                                                        max="5"
                                                        defaultValue="5"
                                                        className="pl-9"
                                                        required
                                                    />
                                                </div>
                                                <InputError
                                                    message={
                                                        errors.satisfaction_score
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label>Departemen</Label>
                                                <Select
                                                    name="department"
                                                    required
                                                    defaultValue="Operations"
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih departemen" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {DEPARTMENTS.map(
                                                            (department) => (
                                                                <SelectItem
                                                                    key={
                                                                        department
                                                                    }
                                                                    value={
                                                                        department
                                                                    }
                                                                >
                                                                    {department}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.department}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Channel</Label>
                                                <Select
                                                    name="channel"
                                                    required
                                                    defaultValue="Website"
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih channel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {CHANNELS.map(
                                                            (channel) => (
                                                                <SelectItem
                                                                    key={
                                                                        channel
                                                                    }
                                                                    value={
                                                                        channel
                                                                    }
                                                                >
                                                                    {channel}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.channel}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="feedback">
                                                Feedback
                                            </Label>
                                            <div className="relative">
                                                <MessageSquareText className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
                                                <textarea
                                                    id="feedback"
                                                    name="feedback"
                                                    rows={5}
                                                    className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    placeholder="Tulis komentar responden, konteks masalah, atau insight yang perlu ditindaklanjuti"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.feedback}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-3 rounded-xl border bg-secondary/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Simpan sebagai data survey
                                                    baru
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Data akan langsung tersedia
                                                    di Hasil Survey, Dashboard,
                                                    dan Report.
                                                </p>
                                            </div>
                                            <Button
                                                disabled={processing}
                                                aria-busy={processing}
                                                className="shrink-0"
                                            >
                                                {processing ? (
                                                    <Spinner />
                                                ) : (
                                                    <Send className="size-4" />
                                                )}
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan survey'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <aside className="space-y-4">
                        <Card className="border-muted/80 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    Panduan skor
                                </CardTitle>
                                <CardDescription>
                                    Gunakan skala yang konsisten untuk menjaga
                                    kualitas analitik.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                {scoreGuides.map((guide) => (
                                    <div
                                        key={guide.score}
                                        className="flex items-center gap-3 rounded-lg border bg-secondary/25 p-3"
                                    >
                                        <div className="grid size-8 place-items-center rounded-md bg-background text-sm font-semibold">
                                            {guide.score}
                                        </div>
                                        <p className="text-sm font-medium">
                                            {guide.label}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-muted/80 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    Output otomatis
                                </CardTitle>
                                <CardDescription>
                                    Setiap response baru ikut memperbarui tabel
                                    hasil, visual dashboard, dan export Excel.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </aside>
                </div>
            </div>
        </>
    );
}

Survey.layout = {
    breadcrumbs: [
        {
            title: 'Survey',
            href: create(),
        },
    ],
};

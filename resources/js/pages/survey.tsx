import { Form, Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { create } from '@/routes/survey';

const departments = ['Operations', 'Sales', 'Marketing', 'Product', 'Support'];
const channels = ['Website', 'Email', 'WhatsApp', 'Walk-in'];

export default function Survey() {
    return (
        <>
            <Head title="Survey" />

            <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                    <Card className="bg-primary text-primary-foreground">
                        <CardHeader>
                            <div className="mb-6 grid size-12 place-items-center rounded-lg bg-white/15">
                                <ClipboardList className="size-6" />
                            </div>
                            <CardTitle className="text-2xl">Input Survey</CardTitle>
                            <CardDescription className="text-primary-foreground/75">
                                Kumpulkan feedback responden untuk dipakai di dashboard analytics dan report Excel.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm text-primary-foreground/80">
                            <div className="rounded-lg bg-white/10 p-4">
                                <p className="font-medium text-primary-foreground">Skor 1 sampai 5</p>
                                <p>1 berarti sangat tidak puas, 5 berarti sangat puas.</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4">
                                <p className="font-medium text-primary-foreground">Data tersimpan</p>
                                <p>Hasil input langsung muncul di menu Hasil Survey.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Form responden</CardTitle>
                            <CardDescription>Isi data dummy survey untuk kebutuhan analitik.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...create.form()} className="grid gap-5">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="respondent_name">Nama responden</Label>
                                            <Input id="respondent_name" name="respondent_name" placeholder="Contoh: Budi Santoso" required />
                                            <InputError message={errors.respondent_name} />
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" name="email" placeholder="nama@email.com" required />
                                                <InputError message={errors.email} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="satisfaction_score">Skor kepuasan</Label>
                                                <Input id="satisfaction_score" type="number" name="satisfaction_score" min="1" max="5" defaultValue="5" required />
                                                <InputError message={errors.satisfaction_score} />
                                            </div>
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label>Departemen</Label>
                                                <Select name="department" required defaultValue="Operations">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih departemen" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map((department) => (
                                                            <SelectItem key={department} value={department}>{department}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.department} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Channel</Label>
                                                <Select name="channel" required defaultValue="Website">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih channel" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {channels.map((channel) => (
                                                            <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.channel} />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="feedback">Feedback</Label>
                                            <textarea id="feedback" name="feedback" rows={5} className="min-h-28 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" placeholder="Tulis komentar responden" />
                                            <InputError message={errors.feedback} />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button disabled={processing}>Simpan survey</Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
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

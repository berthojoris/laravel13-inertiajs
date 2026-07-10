import type { FormComponentRef } from '@inertiajs/core';
import { Form, Head } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    Send,
} from 'lucide-react';
import { useRef, useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { create, store } from '@/routes/survey-extra';

type SurveyExtraFormValues = Partial<
    Record<string, FormDataEntryValue | FormDataEntryValue[]>
>;

type SurveyExtraFormErrors = Record<string, string>;

type Option = {
    value: string;
    label: string;
};

type TextQuestion = {
    type: 'text';
    name: string;
    label: string;
    placeholder: string;
};

type SelectQuestion = {
    type: 'select';
    name: string;
    label: string;
    placeholder: string;
    options: Option[];
};

type CheckboxQuestion = {
    type: 'checkbox';
    name: string;
    label: string;
    options: Option[];
};

type RadioQuestion = {
    type: 'radio';
    name: string;
    label: string;
    options: Option[];
};

type SurveyExtraQuestion =
    TextQuestion | SelectQuestion | CheckboxQuestion | RadioQuestion;

type SurveyStep = {
    title: string;
    description: string;
    questions: SurveyExtraQuestion[];
};

const steps: SurveyStep[] = [
    {
        title: 'Profil kebutuhan',
        description: 'Kumpulkan konteks dasar responden dan area kerja.',
        questions: [
            {
                type: 'text',
                name: 'q1',
                label: 'Nama responden',
                placeholder: 'Contoh: Ayu Lestari',
            },
            {
                type: 'select',
                name: 'q2',
                label: 'Tim utama responden',
                placeholder: 'Pilih tim',
                options: [
                    { value: 'sales', label: 'Sales' },
                    { value: 'support', label: 'Support' },
                    { value: 'operations', label: 'Operations' },
                    { value: 'finance', label: 'Finance' },
                ],
            },
            {
                type: 'checkbox',
                name: 'q3',
                label: 'Hal yang paling perlu ditingkatkan',
                options: [
                    { value: 'speed', label: 'Kecepatan respon' },
                    { value: 'accuracy', label: 'Akurasi data' },
                    { value: 'communication', label: 'Komunikasi tim' },
                    { value: 'documentation', label: 'Dokumentasi proses' },
                ],
            },
            {
                type: 'radio',
                name: 'q4',
                label: 'Apakah proses saat ini sudah jelas?',
                options: [
                    { value: 'yes', label: 'Ya, sudah jelas' },
                    { value: 'no', label: 'Belum jelas' },
                ],
            },
            {
                type: 'text',
                name: 'q5',
                label: 'Satu kendala terbesar minggu ini',
                placeholder: 'Tulis kendala utama yang paling terasa',
            },
        ],
    },
    {
        title: 'Pengalaman operasional',
        description: 'Ukur frekuensi, channel, dan kemudahan penggunaan.',
        questions: [
            {
                type: 'select',
                name: 'q6',
                label: 'Frekuensi menggunakan sistem',
                placeholder: 'Pilih frekuensi',
                options: [
                    { value: 'daily', label: 'Setiap hari' },
                    { value: 'weekly', label: 'Setiap minggu' },
                    { value: 'monthly', label: 'Setiap bulan' },
                    { value: 'rarely', label: 'Jarang' },
                ],
            },
            {
                type: 'checkbox',
                name: 'q7',
                label: 'Channel yang paling sering dipakai',
                options: [
                    { value: 'web', label: 'Web app' },
                    { value: 'mobile', label: 'Mobile' },
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Telepon' },
                ],
            },
            {
                type: 'radio',
                name: 'q8',
                label: 'Seberapa mudah menemukan informasi?',
                options: [
                    { value: 'very_easy', label: 'Sangat mudah' },
                    { value: 'easy', label: 'Mudah' },
                    { value: 'neutral', label: 'Biasa saja' },
                    { value: 'hard', label: 'Sulit' },
                ],
            },
            {
                type: 'text',
                name: 'q9',
                label: 'Fitur yang paling sering digunakan',
                placeholder: 'Contoh: dashboard report harian',
            },
            {
                type: 'select',
                name: 'q10',
                label: 'Prioritas perbaikan menurut responden',
                placeholder: 'Pilih prioritas',
                options: [
                    { value: 'low', label: 'Rendah' },
                    { value: 'medium', label: 'Sedang' },
                    { value: 'high', label: 'Tinggi' },
                    { value: 'urgent', label: 'Mendesak' },
                ],
            },
        ],
    },
    {
        title: 'Rencana tindak lanjut',
        description: 'Prioritaskan dukungan dan target implementasi.',
        questions: [
            {
                type: 'checkbox',
                name: 'q11',
                label: 'Dukungan yang dibutuhkan',
                options: [
                    { value: 'training', label: 'Training' },
                    { value: 'automation', label: 'Automation' },
                    { value: 'reporting', label: 'Reporting' },
                    { value: 'integration', label: 'Integration' },
                ],
            },
            {
                type: 'radio',
                name: 'q12',
                label: 'Media follow-up paling nyaman',
                options: [
                    { value: 'email', label: 'Email' },
                    { value: 'chat', label: 'Chat' },
                    { value: 'meeting', label: 'Meeting' },
                    { value: 'dashboard', label: 'Dashboard note' },
                ],
            },
            {
                type: 'text',
                name: 'q13',
                label: 'Ide improvement paling berdampak',
                placeholder: 'Tulis ide yang menurut responden paling penting',
            },
            {
                type: 'select',
                name: 'q14',
                label: 'Target waktu implementasi',
                placeholder: 'Pilih target',
                options: [
                    { value: 'one_month', label: '1 bulan' },
                    { value: 'three_months', label: '3 bulan' },
                    { value: 'six_months', label: '6 bulan' },
                    { value: 'one_year', label: '1 tahun' },
                ],
            },
            {
                type: 'checkbox',
                name: 'q15',
                label: 'Indikator sukses yang perlu dipantau',
                options: [
                    { value: 'quality', label: 'Kualitas output' },
                    { value: 'cost', label: 'Efisiensi biaya' },
                    { value: 'time', label: 'Waktu penyelesaian' },
                    { value: 'experience', label: 'Pengalaman pengguna' },
                ],
            },
        ],
    },
];

const optionLabelClassName =
    'flex items-center gap-3 rounded-lg border bg-secondary/25 px-3 py-2 text-sm';

function getError(
    errors: Record<string, string>,
    name: string,
): string | undefined {
    return errors[name] ?? errors[`${name}.0`];
}

function isBlankValue(
    value: FormDataEntryValue | FormDataEntryValue[] | undefined,
): boolean {
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return value === undefined || String(value).trim() === '';
}

function validateRequiredFields(
    data: SurveyExtraFormValues,
): SurveyExtraFormErrors {
    return steps
        .flatMap((step) => step.questions)
        .reduce<SurveyExtraFormErrors>((errors, question) => {
            if (isBlankValue(data[question.name])) {
                errors[question.name] = `${question.label} wajib diisi.`;
            }

            return errors;
        }, {});
}

function validateStepFields(
    stepIndex: number,
    data: SurveyExtraFormValues,
): SurveyExtraFormErrors {
    return steps[stepIndex].questions.reduce<SurveyExtraFormErrors>((errors, question) => {
        if (isBlankValue(data[question.name])) {
            errors[question.name] = `${question.label} wajib diisi.`;
        }

        return errors;
    }, {});
}

function QuestionField({
    question,
    error,
}: {
    question: SurveyExtraQuestion;
    error?: string;
}) {
    if (question.type === 'text') {
        return (
            <div className="grid gap-2">
                <Label htmlFor={question.name}>{question.label}</Label>
                <Input
                    id={question.name}
                    name={question.name}
                    placeholder={question.placeholder}
                    aria-invalid={!!error}
                />
                <InputError message={error} />
            </div>
        );
    }

    if (question.type === 'select') {
        return (
            <div className="grid gap-2">
                <Label>{question.label}</Label>
                <Select name={question.name}>
                    <SelectTrigger className="w-full" aria-invalid={!!error}>
                        <SelectValue placeholder={question.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {question.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={error} />
            </div>
        );
    }

    if (question.type === 'checkbox') {
        return (
            <fieldset className="grid gap-3">
                <legend className="text-sm font-medium">
                    {question.label}
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                        <label
                            key={option.value}
                            className={cn(
                                optionLabelClassName,
                                error &&
                                    'border-red-500 bg-red-50/50 dark:border-red-400 dark:bg-red-950/20',
                            )}
                        >
                            <Checkbox
                                name={`${question.name}[]`}
                                value={option.value}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
                <InputError message={error} />
            </fieldset>
        );
    }

    return (
        <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">{question.label}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => (
                    <label
                        key={option.value}
                        className={cn(
                            optionLabelClassName,
                            error &&
                                'border-red-500 bg-red-50/50 dark:border-red-400 dark:bg-red-950/20',
                        )}
                    >
                        <input
                            type="radio"
                            name={question.name}
                            value={option.value}
                            className="size-4 border-input text-primary focus:ring-ring"
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </div>
            <InputError message={error} />
        </fieldset>
    );
}

export default function SurveyExtra() {
    const formRef = useRef<FormComponentRef<SurveyExtraFormValues>>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [clientErrors, setClientErrors] = useState<SurveyExtraFormErrors>({});
    const activeStep = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    function validateAndSetErrors(): SurveyExtraFormErrors {
        const data = formRef.current?.getData() ?? {};
        const nextErrors = validateRequiredFields(data);

        setClientErrors(nextErrors);
        formRef.current?.clearErrors();

        return nextErrors;
    }

    function handleNext(): void {
        const data = formRef.current?.getData() ?? {};
        const nextErrors = validateStepFields(currentStep, data);

        setClientErrors(nextErrors);
        formRef.current?.clearErrors();

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }

    function handlePrev(): void {
        setClientErrors({});
        formRef.current?.clearErrors();
        setCurrentStep((step) => Math.max(step - 1, 0));
    }

    return (
        <>
            <Head title="Survey Extra" />

            <div className="space-y-6 p-4 sm:p-6">
                <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500 via-emerald-500 to-amber-500" />
                    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_22rem] lg:p-8">
                        <div className="max-w-3xl space-y-4">
                            <Badge
                                variant="secondary"
                                className="w-fit gap-2 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                            >
                                <ClipboardCheck className="size-3.5" />
                                Survey Extra
                            </Badge>
                            <div className="space-y-3">
                                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                                    Form tiga langkah untuk menangkap insight
                                    tambahan
                                </h1>
                                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                                    Jawab 15 pertanyaan dengan kombinasi text,
                                    dropdown, checkbox, dan radio button. Data
                                    tersimpan sebagai response survey extra.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-secondary/40 p-4">
                            <p className="text-sm font-medium">Progress form</p>
                            <p className="mt-1 text-2xl font-semibold tracking-tight">
                                Step {currentStep + 1} dari {steps.length}
                            </p>
                            <div className="mt-5 grid gap-2">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2
                                            className={
                                                index <= currentStep
                                                    ? 'size-4 text-emerald-600 dark:text-emerald-400'
                                                    : 'size-4 text-muted-foreground'
                                            }
                                        />
                                        <span>{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="border-muted/80 shadow-sm">
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardTitle>{activeStep.title}</CardTitle>
                                <CardDescription>
                                    {activeStep.description}
                                </CardDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className="w-fit bg-background"
                            >
                                {activeStep.questions.length} pertanyaan
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
                            ref={formRef}
                            resetOnSuccess
                            className="grid gap-6"
                            onBefore={() => {
                                const nextErrors = validateAndSetErrors();

                                if (Object.keys(nextErrors).length > 0) {
                                    formRef.current?.setError(nextErrors);

                                    const firstErrorQuestion = steps
                                        .flatMap((step) => step.questions)
                                        .find(
                                            (question) =>
                                                nextErrors[question.name],
                                        );

                                    if (firstErrorQuestion) {
                                        const stepIndex = steps.findIndex(
                                            (step) =>
                                                step.questions.some(
                                                    (question) =>
                                                        question.name ===
                                                        firstErrorQuestion.name,
                                                ),
                                        );

                                        setCurrentStep(Math.max(stepIndex, 0));
                                    }

                                    return false;
                                }

                                return true;
                            }}
                        >
                            {({ processing, errors }) => {
                                const validationErrors = {
                                    ...errors,
                                    ...clientErrors,
                                };

                                return (
                                    <>
                                        {steps.map((step, index) => (
                                            <div
                                                key={step.title}
                                                className={
                                                    index === currentStep
                                                        ? 'grid gap-5 lg:grid-cols-2'
                                                        : 'hidden'
                                                }
                                            >
                                                {step.questions.map(
                                                    (question) => (
                                                        <QuestionField
                                                            key={question.name}
                                                            question={question}
                                                            error={getError(
                                                                validationErrors,
                                                                question.name,
                                                            )}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ))}

                                        <div className="flex flex-col gap-3 rounded-xl border bg-secondary/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Navigasi step survey extra
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Gunakan Next dan Prev untuk
                                                    berpindah halaman. Submit
                                                    hanya tersedia di step
                                                    terakhir.
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                {!isFirstStep && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handlePrev}
                                                    >
                                                        <ArrowLeft className="size-4" />
                                                        Prev
                                                    </Button>
                                                )}
                                                {!isLastStep && (
                                                    <Button
                                                        type="button"
                                                        onClick={handleNext}
                                                    >
                                                        Next
                                                        <ArrowRight className="size-4" />
                                                    </Button>
                                                )}
                                                {isLastStep && (
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        aria-busy={processing}
                                                    >
                                                        {processing ? (
                                                            <Spinner />
                                                        ) : (
                                                            <Send className="size-4" />
                                                        )}
                                                        {processing
                                                            ? 'Submitting...'
                                                            : 'Submit Survey'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SurveyExtra.layout = {
    breadcrumbs: [
        {
            title: 'Survey Extra',
            href: create(),
        },
    ],
};

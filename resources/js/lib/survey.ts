export const DEPARTMENTS = ['Operations', 'Sales', 'Marketing', 'Product', 'Support'] as const;

export const CHANNELS = ['Website', 'Email', 'WhatsApp', 'Walk-in'] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type SurveyChannel = (typeof CHANNELS)[number];

export type SurveyFormValues = {
    respondent_name?: string;
    email?: string;
    department?: string;
    satisfaction_score?: string | number;
    channel?: string;
    feedback?: string | null;
};

export type SurveyFormErrors = Partial<
    Record<keyof SurveyFormValues, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isDepartment(value: string): value is Department {
    return (DEPARTMENTS as readonly string[]).includes(value);
}

function isChannel(value: string): value is SurveyChannel {
    return (CHANNELS as readonly string[]).includes(value);
}

export function validateSurveyForm(
    data: SurveyFormValues,
): SurveyFormErrors {
    const errors: SurveyFormErrors = {};

    const respondentName = data.respondent_name?.trim() ?? '';

    if (respondentName === '') {
        errors.respondent_name = 'Nama responden wajib diisi.';
    } else if (respondentName.length > 255) {
        errors.respondent_name = 'Nama responden maksimal 255 karakter.';
    }

    const email = data.email?.trim() ?? '';

    if (email === '') {
        errors.email = 'Email wajib diisi.';
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = 'Format email tidak valid.';
    } else if (email.length > 255) {
        errors.email = 'Email maksimal 255 karakter.';
    }

    const department = data.department?.trim() ?? '';

    if (department === '') {
        errors.department = 'Departemen wajib dipilih.';
    } else if (!isDepartment(department)) {
        errors.department = 'Departemen tidak valid.';
    }

    const scoreRaw = data.satisfaction_score;
    const score =
        typeof scoreRaw === 'number'
            ? scoreRaw
            : Number.parseInt(String(scoreRaw ?? '').trim(), 10);

    if (
        scoreRaw === undefined ||
        scoreRaw === null ||
        String(scoreRaw).trim() === ''
    ) {
        errors.satisfaction_score = 'Skor kepuasan wajib diisi.';
    } else if (
        !Number.isInteger(score) ||
        score < 1 ||
        score > 5
    ) {
        errors.satisfaction_score = 'Skor kepuasan harus bilangan 1 sampai 5.';
    }

    const channel = data.channel?.trim() ?? '';

    if (channel === '') {
        errors.channel = 'Channel wajib dipilih.';
    } else if (!isChannel(channel)) {
        errors.channel = 'Channel tidak valid.';
    }

    const feedback = data.feedback?.trim() ?? '';

    if (feedback.length > 1000) {
        errors.feedback = 'Feedback maksimal 1000 karakter.';
    }

    return errors;
}

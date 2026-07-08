export const DEPARTMENTS = ['Operations', 'Sales', 'Marketing', 'Product', 'Support'] as const;

export const CHANNELS = ['Website', 'Email', 'WhatsApp', 'Walk-in'] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type SurveyChannel = (typeof CHANNELS)[number];

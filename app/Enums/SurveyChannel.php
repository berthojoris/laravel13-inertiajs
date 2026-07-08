<?php

namespace App\Enums;

enum SurveyChannel: string
{
    case Website = 'Website';
    case Email = 'Email';
    case WhatsApp = 'WhatsApp';
    case WalkIn = 'Walk-in';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

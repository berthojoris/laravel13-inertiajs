<?php

namespace App\Enums;

enum Department: string
{
    case Operations = 'Operations';
    case Sales = 'Sales';
    case Marketing = 'Marketing';
    case Product = 'Product';
    case Support = 'Support';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

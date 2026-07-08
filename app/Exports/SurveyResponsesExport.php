<?php

namespace App\Exports;

use App\Models\SurveyResponse;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SurveyResponsesExport implements FromCollection, WithHeadings
{
    public function __construct(
        private readonly string $startDate,
        private readonly string $endDate,
    ) {}

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function collection(): Collection
    {
        /** @var array<int, array<string, mixed>> $rows */
        $rows = [];

        SurveyResponse::query()
            ->whereDate('created_at', '>=', $this->startDate)
            ->whereDate('created_at', '<=', $this->endDate)
            ->latest()
            ->get()
            ->each(function (SurveyResponse $response) use (&$rows): void {
                $rows[] = [
                    'date' => $response->created_at?->format('Y-m-d H:i:s'),
                    'respondent_name' => $response->respondent_name,
                    'email' => $response->email,
                    'department' => $response->department,
                    'satisfaction_score' => $response->satisfaction_score,
                    'channel' => $response->channel,
                    'feedback' => $response->feedback,
                ];
            });

        return collect($rows);
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return ['Date', 'Name', 'Email', 'Department', 'Score', 'Channel', 'Feedback'];
    }
}

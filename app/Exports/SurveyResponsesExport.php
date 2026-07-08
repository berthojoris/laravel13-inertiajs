<?php

namespace App\Exports;

use App\Models\SurveyResponse;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

/**
 * @implements WithMapping<SurveyResponse>
 */
class SurveyResponsesExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @param  Collection<int, SurveyResponse>  $responses
     */
    public function __construct(
        private readonly Collection $responses,
    ) {}

    /**
     * @return Collection<int, SurveyResponse>
     */
    public function collection(): Collection
    {
        return $this->responses;
    }

    /**
     * @param  SurveyResponse  $row
     * @return array<int, mixed>
     */
    public function map($row): array
    {
        return [
            $row->created_at?->format('Y-m-d H:i:s'),
            $row->respondent_name,
            $row->email,
            $row->department->value,
            $row->satisfaction_score,
            $row->channel->value,
            $row->feedback,
        ];
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return ['Date', 'Name', 'Email', 'Department', 'Score', 'Channel', 'Feedback'];
    }
}

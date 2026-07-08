<?php

namespace App\DTO;

use App\Http\Requests\ExportSurveyReportRequest;

class ReportPeriodData
{
    public function __construct(
        public readonly string $startDate,
        public readonly string $endDate,
    ) {}

    public static function fromRequest(ExportSurveyReportRequest $request): self
    {
        /** @var array{start_date: string, end_date: string} $validated */
        $validated = $request->validated();

        return new self(
            startDate: $validated['start_date'],
            endDate: $validated['end_date'],
        );
    }

    public function filename(): string
    {
        return "survey-report-{$this->startDate}-to-{$this->endDate}.xlsx";
    }
}

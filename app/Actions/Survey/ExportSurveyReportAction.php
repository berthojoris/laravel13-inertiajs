<?php

namespace App\Actions\Survey;

use App\DTO\ReportPeriodData;
use App\Exports\SurveyResponsesExport;
use App\Repositories\SurveyResponseRepository;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportSurveyReportAction
{
    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    public function execute(ReportPeriodData $period): BinaryFileResponse
    {
        $responses = $this->repository->withinPeriod($period);

        return Excel::download(new SurveyResponsesExport($responses), $period->filename());
    }
}

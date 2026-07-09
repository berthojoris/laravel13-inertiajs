<?php

namespace App\Http\Controllers;

use App\Actions\Survey\ExportSurveyReportAction;
use App\DTO\ReportPeriodData;
use App\Http\Requests\ExportSurveyReportRequest;
use App\Models\SurveyResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        $this->authorize('export', SurveyResponse::class);

        return Inertia::render('report');
    }

    public function export(ExportSurveyReportRequest $request, ExportSurveyReportAction $action): BinaryFileResponse
    {
        $this->authorize('export', SurveyResponse::class);

        return $action->execute(ReportPeriodData::fromRequest($request));
    }
}

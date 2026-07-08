<?php

namespace App\Http\Controllers;

use App\Actions\Survey\ExportSurveyReportAction;
use App\DTO\ReportPeriodData;
use App\Http\Requests\ExportSurveyReportRequest;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('report');
    }

    public function export(ExportSurveyReportRequest $request, ExportSurveyReportAction $action): BinaryFileResponse
    {
        return $action->execute(ReportPeriodData::fromRequest($request));
    }
}

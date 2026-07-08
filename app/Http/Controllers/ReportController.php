<?php

namespace App\Http\Controllers;

use App\Exports\SurveyResponsesExport;
use App\Http\Requests\ExportSurveyReportRequest;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('report');
    }

    public function export(ExportSurveyReportRequest $request): BinaryFileResponse
    {
        $validated = $request->validated();
        $filename = "survey-report-{$validated['start_date']}-to-{$validated['end_date']}.xlsx";

        return Excel::download(new SurveyResponsesExport($validated['start_date'], $validated['end_date']), $filename);
    }
}

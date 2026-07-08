<?php

use App\Actions\Survey\ExportSurveyReportAction;
use App\DTO\ReportPeriodData;
use App\Exports\SurveyResponsesExport;
use App\Repositories\SurveyResponseRepository;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

beforeEach(function () {
    $this->repository = Mockery::mock(SurveyResponseRepository::class);
    $this->action = new ExportSurveyReportAction($this->repository);
});

afterEach(function () {
    Mockery::close();
});

test('execute fetches responses in period and returns a download response', function () {
    $period = new ReportPeriodData('2026-07-01', '2026-07-31');

    $responses = Mockery::mock(Collection::class);

    $this->repository->shouldReceive('withinPeriod')
        ->once()
        ->with(Mockery::on(fn (ReportPeriodData $arg) => $arg === $period))
        ->andReturn($responses);

    Excel::fake();

    $response = $this->action->execute($period);

    expect($response)->toBeInstanceOf(BinaryFileResponse::class);

    Excel::assertDownloaded('survey-report-2026-07-01-to-2026-07-31.xlsx', function (SurveyResponsesExport $export) use ($responses) {
        return $export->collection() === $responses;
    });
});

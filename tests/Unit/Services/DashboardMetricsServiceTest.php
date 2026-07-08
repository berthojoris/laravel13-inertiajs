<?php

use App\Repositories\SurveyResponseRepository;
use App\Services\DashboardMetricsService;

beforeEach(function () {
    $this->repository = Mockery::mock(SurveyResponseRepository::class);
    $this->service = new DashboardMetricsService($this->repository);
});

afterEach(function () {
    Mockery::close();
});

test('build returns fallback metrics when repository returns no data', function () {
    $this->repository->shouldReceive('averageSatisfaction')->once()->andReturnNull();
    $this->repository->shouldReceive('count')->once()->andReturn(0);

    $result = $this->service->build();

    expect($result)->toHaveKeys(['metrics', 'monthlyResponses', 'satisfactionSplit', 'channelData', 'departmentScores']);
    expect($result['metrics'][0]['value'])->toBe(1248);
    expect($result['metrics'][1]['value'])->toBe('4.2');
    expect($result['monthlyResponses'])->toBe([42, 58, 73, 65, 92, 118, 132, 146]);
});

test('build formats average satisfaction from repository', function () {
    $this->repository->shouldReceive('averageSatisfaction')->once()->andReturn(4.583);
    $this->repository->shouldReceive('count')->once()->andReturn(250);

    $result = $this->service->build();

    expect($result['metrics'][0]['value'])->toBe(250);
    expect($result['metrics'][1]['value'])->toBe('4.6');
});

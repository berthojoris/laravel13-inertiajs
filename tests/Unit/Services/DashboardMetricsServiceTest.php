<?php

use App\Enums\SurveyChannel;
use App\Repositories\SurveyResponseRepository;
use App\Services\DashboardMetricsService;

beforeEach(function () {
    $this->repository = Mockery::mock(SurveyResponseRepository::class);
    $this->service = new DashboardMetricsService($this->repository);
});

afterEach(function () {
    Mockery::close();
});

/**
 * @return array<int, array{date: string, count: int}>
 */
function emptyDailyActivity(int $days = 14): array
{
    return collect(range(0, $days - 1))
        ->map(fn (int $offset): array => [
            'date' => now()->subDays($days - 1 - $offset)->format('Y-m-d'),
            'count' => 0,
        ])
        ->all();
}

function stubEmptyDashboardRepository($repository): void
{
    $repository->shouldReceive('count')->andReturn(0);
    $repository->shouldReceive('averageSatisfaction')->andReturnNull();
    $repository->shouldReceive('countWithFeedback')->andReturn(0);
    $repository->shouldReceive('distinctChannelCount')->andReturn(0);
    $repository->shouldReceive('averageScoreByDepartment')->andReturn([]);
    $repository->shouldReceive('monthlyCounts')->with(8)->andReturn(array_fill(0, 8, 0));
    $repository->shouldReceive('countsBySatisfactionScore')->andReturn([]);
    $repository->shouldReceive('countByChannel')->andReturn([]);
    $repository->shouldReceive('dailyCounts')->with(14)->andReturn(emptyDailyActivity());
    $repository->shouldReceive('countCreatedBetween')->andReturn(0);
    $repository->shouldReceive('averageSatisfactionBetween')->andReturnNull();
}

test('build returns zeroed live metrics when repository has no data', function () {
    stubEmptyDashboardRepository($this->repository);

    $result = $this->service->build();

    expect($result)->toHaveKeys([
        'metrics',
        'monthlyResponses',
        'satisfactionSplit',
        'channelData',
        'departmentScores',
        'departmentAverages',
        'dailyActivity',
        'completionRate',
    ]);
    expect($result['metrics'][0]['value'])->toBe(0);
    expect($result['metrics'][1]['value'])->toBe('0.0');
    expect($result['metrics'][2]['value'])->toBe('0%');
    expect($result['metrics'][3]['value'])->toBe(0);
    expect($result['monthlyResponses'])->toBe(array_fill(0, 8, 0));
    expect($result['completionRate'])->toBe(0);
    expect($result['dailyActivity'])->toHaveCount(14);
    expect($result['satisfactionSplit'])->toHaveCount(4);
    expect(collect($result['satisfactionSplit'])->pluck('value')->all())->toBe([0, 0, 0, 0]);
    expect($result['channelData'])->toHaveCount(count(SurveyChannel::cases()));
    expect($result['departmentScores'])->toHaveCount(5);
});

test('build formats average satisfaction and completion from repository', function () {
    $this->repository->shouldReceive('count')->andReturn(250);
    $this->repository->shouldReceive('averageSatisfaction')->andReturn(4.583);
    $this->repository->shouldReceive('countWithFeedback')->andReturn(200);
    $this->repository->shouldReceive('distinctChannelCount')->andReturn(3);
    $this->repository->shouldReceive('averageScoreByDepartment')->andReturn(['Support' => 4.5]);
    $this->repository->shouldReceive('monthlyCounts')->with(8)->andReturn([1, 2, 3, 4, 5, 6, 7, 8]);
    $this->repository->shouldReceive('countsBySatisfactionScore')->andReturn([
        5 => 100,
        4 => 80,
        3 => 40,
        2 => 20,
        1 => 10,
    ]);
    $this->repository->shouldReceive('countByChannel')->andReturn(['Website' => 120]);
    $this->repository->shouldReceive('dailyCounts')->with(14)->andReturn([
        ['date' => '2026-07-07', 'count' => 5],
    ]);
    $this->repository->shouldReceive('countCreatedBetween')->andReturn(10, 5);
    $this->repository->shouldReceive('averageSatisfactionBetween')->andReturn(4.5, 4.0);

    $result = $this->service->build();

    expect($result['metrics'][0]['value'])->toBe(250);
    expect($result['metrics'][1]['value'])->toBe('4.6');
    expect($result['metrics'][2]['value'])->toBe('80%');
    expect($result['metrics'][3]['value'])->toBe(3);
    expect($result['completionRate'])->toBe(80);
    expect($result['departmentAverages'][0])->toBe(['label' => 'Support', 'value' => 4.5]);
    expect($result['departmentScores'])->toBe($result['departmentAverages']);
    expect(collect($result['satisfactionSplit'])->pluck('value')->all())->toBe([100, 80, 40, 30]);
    expect($result['channelData'][0])->toBe(['label' => 'Website', 'value' => 120]);
    expect($result['dailyActivity'])->toBe([['date' => '2026-07-07', 'count' => 5]]);
    expect($result['monthlyResponses'])->toBe([1, 2, 3, 4, 5, 6, 7, 8]);
});

test('build uses repository aggregates without demo fallbacks', function () {
    $this->repository->shouldReceive('count')->andReturn(100);
    $this->repository->shouldReceive('averageSatisfaction')->andReturn(4.0);
    $this->repository->shouldReceive('countWithFeedback')->andReturn(50);
    $this->repository->shouldReceive('distinctChannelCount')->andReturn(2);
    $this->repository->shouldReceive('averageScoreByDepartment')->andReturn(['Support' => 4.5]);
    $this->repository->shouldReceive('monthlyCounts')->with(8)->andReturn(array_fill(0, 8, 2));
    $this->repository->shouldReceive('countsBySatisfactionScore')->andReturn([
        5 => 25,
        4 => 25,
        3 => 25,
        2 => 25,
    ]);
    $this->repository->shouldReceive('countByChannel')->andReturn(['Email' => 40]);
    $this->repository->shouldReceive('dailyCounts')->with(14)->andReturn([
        ['date' => '2026-07-07', 'count' => 5],
    ]);
    $this->repository->shouldReceive('countCreatedBetween')->andReturn(0);
    $this->repository->shouldReceive('averageSatisfactionBetween')->andReturnNull();

    $result = $this->service->build();

    expect($result['departmentAverages'][0])->toBe(['label' => 'Support', 'value' => 4.5]);
    expect($result['channelData'][0])->toBe(['label' => 'Email', 'value' => 40]);
    expect($result['dailyActivity'])->toBe([['date' => '2026-07-07', 'count' => 5]]);
    expect($result['completionRate'])->toBe(50);
});

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
    $repository->shouldReceive('averageScoreByDepartment')->andReturn([
        ['label' => 'Operations', 'value' => 0.0],
        ['label' => 'Sales', 'value' => 0.0],
        ['label' => 'Marketing', 'value' => 0.0],
        ['label' => 'Product', 'value' => 0.0],
        ['label' => 'Support', 'value' => 0.0],
    ]);
    $repository->shouldReceive('monthlyCounts')->with(8)->andReturn(array_fill(0, 8, 0));
    $repository->shouldReceive('satisfactionSplit')->andReturn([
        ['label' => 'Very satisfied', 'value' => 0, 'color' => '#2563eb'],
        ['label' => 'Satisfied', 'value' => 0, 'color' => '#14b8a6'],
        ['label' => 'Neutral', 'value' => 0, 'color' => '#f59e0b'],
        ['label' => 'Unsatisfied', 'value' => 0, 'color' => '#ef4444'],
    ]);
    $repository->shouldReceive('countByChannel')->andReturn(
        collect(SurveyChannel::cases())
            ->map(fn (SurveyChannel $channel): array => ['label' => $channel->value, 'value' => 0])
            ->all()
    );
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
});

test('build formats average satisfaction and completion from repository', function () {
    $this->repository->shouldReceive('count')->andReturn(250);
    $this->repository->shouldReceive('averageSatisfaction')->andReturn(4.583);
    $this->repository->shouldReceive('countWithFeedback')->andReturn(200);
    $this->repository->shouldReceive('distinctChannelCount')->andReturn(3);
    $this->repository->shouldReceive('averageScoreByDepartment')->andReturn([
        ['label' => 'Support', 'value' => 4.5],
    ]);
    $this->repository->shouldReceive('monthlyCounts')->with(8)->andReturn([1, 2, 3, 4, 5, 6, 7, 8]);
    $this->repository->shouldReceive('satisfactionSplit')->andReturn([
        ['label' => 'Very satisfied', 'value' => 100, 'color' => '#2563eb'],
        ['label' => 'Satisfied', 'value' => 80, 'color' => '#14b8a6'],
        ['label' => 'Neutral', 'value' => 40, 'color' => '#f59e0b'],
        ['label' => 'Unsatisfied', 'value' => 30, 'color' => '#ef4444'],
    ]);
    $this->repository->shouldReceive('countByChannel')->andReturn([
        ['label' => 'Website', 'value' => 120],
    ]);
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
    expect($result['departmentAverages'])->toBe([['label' => 'Support', 'value' => 4.5]]);
    expect($result['dailyActivity'])->toBe([['date' => '2026-07-07', 'count' => 5]]);
    expect($result['monthlyResponses'])->toBe([1, 2, 3, 4, 5, 6, 7, 8]);
});

test('build uses repository aggregates without demo fallbacks', function () {
    $this->repository->shouldReceive('count')->andReturn(100);
    $this->repository->shouldReceive('averageSatisfaction')->andReturn(4.0);
    $this->repository->shouldReceive('countWithFeedback')->andReturn(50);
    $this->repository->shouldReceive('distinctChannelCount')->andReturn(2);
    $this->repository->shouldReceive('averageScoreByDepartment')->andReturn([
        ['label' => 'Support', 'value' => 4.5],
    ]);
    $this->repository->shouldReceive('monthlyCounts')->with(8)->andReturn(array_fill(0, 8, 2));
    $this->repository->shouldReceive('satisfactionSplit')->andReturn([
        ['label' => 'Very satisfied', 'value' => 25, 'color' => '#2563eb'],
        ['label' => 'Satisfied', 'value' => 25, 'color' => '#14b8a6'],
        ['label' => 'Neutral', 'value' => 25, 'color' => '#f59e0b'],
        ['label' => 'Unsatisfied', 'value' => 25, 'color' => '#ef4444'],
    ]);
    $this->repository->shouldReceive('countByChannel')->andReturn([
        ['label' => 'Email', 'value' => 40],
    ]);
    $this->repository->shouldReceive('dailyCounts')->with(14)->andReturn([
        ['date' => '2026-07-07', 'count' => 5],
    ]);
    $this->repository->shouldReceive('countCreatedBetween')->andReturn(0);
    $this->repository->shouldReceive('averageSatisfactionBetween')->andReturnNull();

    $result = $this->service->build();

    expect($result['departmentAverages'])->toBe([['label' => 'Support', 'value' => 4.5]]);
    expect($result['channelData'])->toBe([['label' => 'Email', 'value' => 40]]);
    expect($result['dailyActivity'])->toBe([['date' => '2026-07-07', 'count' => 5]]);
    expect($result['completionRate'])->toBe(50);
});

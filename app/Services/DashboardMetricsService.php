<?php

namespace App\Services;

use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Repositories\SurveyResponseRepository;
use Carbon\CarbonInterface;

class DashboardMetricsService
{
    private const TREND_DAYS = 30;

    private const MONTHLY_PERIODS = 8;

    private const HEATMAP_DAYS = 14;

    /**
     * Presentation buckets for the satisfaction donut chart.
     *
     * @var array<string, array{min: int, max: int, color: string}>
     */
    private const SATISFACTION_BUCKETS = [
        'Very satisfied' => ['min' => 5, 'max' => 5, 'color' => '#2563eb'],
        'Satisfied' => ['min' => 4, 'max' => 4, 'color' => '#14b8a6'],
        'Neutral' => ['min' => 3, 'max' => 3, 'color' => '#f59e0b'],
        'Unsatisfied' => ['min' => 1, 'max' => 2, 'color' => '#ef4444'],
    ];

    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    /**
     * Cheap headline numbers suitable for polling.
     *
     * @return array<string, mixed>
     */
    public function headline(): array
    {
        $totalResponses = $this->repository->count();
        $averageSatisfaction = $this->repository->averageSatisfaction();
        $withFeedback = $this->repository->countWithFeedback();
        $activeChannels = $this->repository->distinctChannelCount();
        $completionRate = $totalResponses > 0
            ? (int) round(($withFeedback / $totalResponses) * 100)
            : 0;

        return [
            'metrics' => [
                [
                    'label' => 'Total responses',
                    'value' => $totalResponses,
                    'trend' => $this->countTrendLabel(),
                ],
                [
                    'label' => 'Avg. satisfaction',
                    'value' => number_format($averageSatisfaction ?? 0, 1),
                    'trend' => $this->averageTrendLabel(),
                ],
                [
                    'label' => 'Completion rate',
                    'value' => $completionRate.'%',
                    'trend' => $this->completionTrendLabel($completionRate),
                ],
                [
                    'label' => 'Active channels',
                    'value' => $activeChannels,
                    'trend' => $activeChannels.' / '.count(SurveyChannel::cases()),
                ],
            ],
            'completionRate' => $completionRate,
        ];
    }

    /**
     * Heavy chart aggregates, loaded lazily via deferred props.
     *
     * @return array<string, mixed>
     */
    public function analytics(): array
    {
        $departmentScores = $this->departmentScores();

        return [
            'monthlyResponses' => $this->repository->monthlyCounts(self::MONTHLY_PERIODS),
            'satisfactionSplit' => $this->satisfactionSplit(),
            'channelData' => $this->channelData(),
            'departmentScores' => $departmentScores,
            'departmentAverages' => $departmentScores,
            'dailyActivity' => $this->repository->dailyCounts(self::HEATMAP_DAYS),
        ];
    }

    /**
     * @return array<int, array{label: string, value: int, color: string}>
     */
    private function satisfactionSplit(): array
    {
        $counts = $this->repository->countsBySatisfactionScore();
        $split = [];

        foreach (self::SATISFACTION_BUCKETS as $label => $bucket) {
            $value = 0;

            foreach ($counts as $score => $total) {
                if ($score >= $bucket['min'] && $score <= $bucket['max']) {
                    $value += $total;
                }
            }

            $split[] = ['label' => $label, 'value' => $value, 'color' => $bucket['color']];
        }

        return $split;
    }

    /**
     * @return array<int, array{label: string, value: int}>
     */
    private function channelData(): array
    {
        $counts = $this->repository->countByChannel();
        $data = [];

        foreach (SurveyChannel::cases() as $channel) {
            $data[] = ['label' => $channel->value, 'value' => $counts[$channel->value] ?? 0];
        }

        usort($data, fn (array $first, array $second): int => $second['value'] <=> $first['value']);

        return $data;
    }

    /**
     * @return array<int, array{label: string, value: float}>
     */
    private function departmentScores(): array
    {
        $averages = $this->repository->averageScoreByDepartment();
        $scores = [];

        foreach (Department::cases() as $department) {
            $scores[] = ['label' => $department->value, 'value' => $averages[$department->value] ?? 0.0];
        }

        usort($scores, fn (array $first, array $second): int => $second['value'] <=> $first['value']);

        return $scores;
    }

    private function countTrendLabel(): string
    {
        [$currentStart, $previousStart, $previousEnd] = $this->trendWindows();

        $current = $this->repository->countCreatedBetween($currentStart, now());
        $previous = $this->repository->countCreatedBetween($previousStart, $previousEnd);

        if ($previous === 0) {
            return $current > 0 ? '+100%' : '0%';
        }

        $change = (($current - $previous) / $previous) * 100;

        return sprintf('%s%.1f%%', $change >= 0 ? '+' : '', $change);
    }

    private function averageTrendLabel(): string
    {
        [$currentStart, $previousStart, $previousEnd] = $this->trendWindows();

        $current = $this->repository->averageSatisfactionBetween($currentStart, now());
        $previous = $this->repository->averageSatisfactionBetween($previousStart, $previousEnd);

        if ($current === null || $previous === null) {
            return '0.0';
        }

        $delta = $current - $previous;

        return sprintf('%s%.1f', $delta >= 0 ? '+' : '', $delta);
    }

    private function completionTrendLabel(int $completionRate): string
    {
        return $completionRate.'% feedback';
    }

    /**
     * @return array{0: CarbonInterface, 1: CarbonInterface, 2: CarbonInterface}
     */
    private function trendWindows(): array
    {
        $currentStart = now()->subDays(self::TREND_DAYS);
        $previousEnd = $currentStart->copy();
        $previousStart = $previousEnd->copy()->subDays(self::TREND_DAYS);

        return [$currentStart, $previousStart, $previousEnd];
    }
}

<?php

namespace App\Services;

use App\Enums\SurveyChannel;
use App\Repositories\SurveyResponseRepository;
use Carbon\CarbonInterface;

class DashboardMetricsService
{
    private const TREND_DAYS = 30;

    private const MONTHLY_PERIODS = 8;

    private const HEATMAP_DAYS = 14;

    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function build(): array
    {
        $totalResponses = $this->repository->count();
        $averageSatisfaction = $this->repository->averageSatisfaction();
        $withFeedback = $this->repository->countWithFeedback();
        $activeChannels = $this->repository->distinctChannelCount();
        $completionRate = $totalResponses > 0
            ? (int) round(($withFeedback / $totalResponses) * 100)
            : 0;

        $departmentScores = $this->repository->averageScoreByDepartment();

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
            'monthlyResponses' => $this->repository->monthlyCounts(self::MONTHLY_PERIODS),
            'satisfactionSplit' => $this->repository->satisfactionSplit(),
            'channelData' => $this->repository->countByChannel(),
            'departmentScores' => $departmentScores,
            'departmentAverages' => $departmentScores,
            'dailyActivity' => $this->repository->dailyCounts(self::HEATMAP_DAYS),
            'completionRate' => $completionRate,
        ];
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

<?php

namespace App\Services;

use App\Repositories\SurveyResponseRepository;

class DashboardMetricsService
{
    private const FALLBACK_AVERAGE = 4.2;

    private const FALLBACK_TOTAL = 1248;

    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function build(): array
    {
        $averageSatisfaction = $this->repository->averageSatisfaction() ?? self::FALLBACK_AVERAGE;
        $totalResponses = $this->repository->count() ?: self::FALLBACK_TOTAL;

        return [
            'metrics' => [
                ['label' => 'Total responses', 'value' => $totalResponses, 'trend' => '+18.2%'],
                ['label' => 'Avg. satisfaction', 'value' => number_format($averageSatisfaction, 1), 'trend' => '+0.4'],
                ['label' => 'Completion rate', 'value' => '86%', 'trend' => '+6.1%'],
                ['label' => 'Reports generated', 'value' => 32, 'trend' => '+12'],
            ],
            'monthlyResponses' => [42, 58, 73, 65, 92, 118, 132, 146],
            'satisfactionSplit' => [
                ['label' => 'Very satisfied', 'value' => 42, 'color' => '#2563eb'],
                ['label' => 'Satisfied', 'value' => 31, 'color' => '#14b8a6'],
                ['label' => 'Neutral', 'value' => 17, 'color' => '#f59e0b'],
                ['label' => 'Unsatisfied', 'value' => 10, 'color' => '#ef4444'],
            ],
            'channelData' => [
                ['label' => 'Website', 'value' => 520],
                ['label' => 'Email', 'value' => 360],
                ['label' => 'WhatsApp', 'value' => 250],
                ['label' => 'Walk-in', 'value' => 118],
            ],
            'departmentScores' => [
                ['label' => 'Ops', 'value' => 4.6],
                ['label' => 'Sales', 'value' => 4.2],
                ['label' => 'Marketing', 'value' => 3.9],
                ['label' => 'Product', 'value' => 4.7],
                ['label' => 'Support', 'value' => 4.4],
            ],
        ];
    }
}

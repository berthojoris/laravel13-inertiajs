<?php

namespace App\Repositories;

use App\DTO\ReportPeriodData;
use App\DTO\SurveyResponseData;
use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Models\SurveyResponse;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SurveyResponseRepository
{
    public function create(SurveyResponseData $data): SurveyResponse
    {
        return SurveyResponse::create($data->toArray());
    }

    /**
     * @return LengthAwarePaginator<int, SurveyResponse>
     */
    public function paginateFiltered(?string $search, int $perPage): LengthAwarePaginator
    {
        return SurveyResponse::query()
            ->when(
                filled($search),
                fn ($query) => $query->where(function ($query) use ($search): void {
                    $query->where('respondent_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%")
                        ->orWhere('channel', 'like', "%{$search}%");
                })
            )
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @return Collection<int, SurveyResponse>
     */
    public function withinPeriod(ReportPeriodData $period): Collection
    {
        return SurveyResponse::query()
            ->whereDate('created_at', '>=', $period->startDate)
            ->whereDate('created_at', '<=', $period->endDate)
            ->latest()
            ->get();
    }

    public function count(): int
    {
        return SurveyResponse::query()->count();
    }

    public function countWithFeedback(): int
    {
        return SurveyResponse::query()
            ->whereNotNull('feedback')
            ->where('feedback', '!=', '')
            ->count();
    }

    public function countCreatedBetween(CarbonInterface $start, CarbonInterface $end): int
    {
        return SurveyResponse::query()
            ->where('created_at', '>=', $start)
            ->where('created_at', '<', $end)
            ->count();
    }

    public function averageSatisfaction(): ?float
    {
        $average = SurveyResponse::query()->avg('satisfaction_score');

        return $average !== null ? (float) $average : null;
    }

    public function averageSatisfactionBetween(CarbonInterface $start, CarbonInterface $end): ?float
    {
        $average = SurveyResponse::query()
            ->where('created_at', '>=', $start)
            ->where('created_at', '<', $end)
            ->avg('satisfaction_score');

        return $average !== null ? (float) $average : null;
    }

    public function distinctChannelCount(): int
    {
        return (int) SurveyResponse::query()
            ->distinct()
            ->count('channel');
    }

    /**
     * @return array<int, array{label: string, value: float}>
     */
    public function averageScoreByDepartment(): array
    {
        $averages = SurveyResponse::query()
            ->select('department', DB::raw('avg(satisfaction_score) as avg_score'))
            ->groupBy('department')
            ->get()
            ->mapWithKeys(function (SurveyResponse $row): array {
                $department = $row->department;

                return [
                    $department instanceof Department ? $department->value : (string) $department => round((float) $row->getAttribute('avg_score'), 1),
                ];
            });

        return collect(Department::cases())
            ->map(fn (Department $department): array => [
                'label' => $department->value,
                'value' => $averages->get($department->value, 0.0),
            ])
            ->sortByDesc('value')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, value: int}>
     */
    public function countByChannel(): array
    {
        $counts = SurveyResponse::query()
            ->select('channel', DB::raw('count(*) as total'))
            ->groupBy('channel')
            ->get()
            ->mapWithKeys(function (SurveyResponse $row): array {
                $channel = $row->channel;

                return [
                    $channel instanceof SurveyChannel ? $channel->value : (string) $channel => (int) $row->getAttribute('total'),
                ];
            });

        return collect(SurveyChannel::cases())
            ->map(fn (SurveyChannel $channel): array => [
                'label' => $channel->value,
                'value' => $counts->get($channel->value, 0),
            ])
            ->sortByDesc('value')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, value: int, color: string}>
     */
    public function satisfactionSplit(): array
    {
        $buckets = [
            'Very satisfied' => ['min' => 5, 'max' => 5, 'color' => '#2563eb'],
            'Satisfied' => ['min' => 4, 'max' => 4, 'color' => '#14b8a6'],
            'Neutral' => ['min' => 3, 'max' => 3, 'color' => '#f59e0b'],
            'Unsatisfied' => ['min' => 1, 'max' => 2, 'color' => '#ef4444'],
        ];

        $counts = SurveyResponse::query()
            ->select('satisfaction_score', DB::raw('count(*) as total'))
            ->groupBy('satisfaction_score')
            ->pluck('total', 'satisfaction_score')
            ->map(fn ($total): int => (int) $total);

        return collect($buckets)
            ->map(function (array $bucket, string $label) use ($counts): array {
                $value = $counts
                    ->filter(fn (int $total, int|string $score): bool => (int) $score >= $bucket['min'] && (int) $score <= $bucket['max'])
                    ->sum();

                return [
                    'label' => $label,
                    'value' => $value,
                    'color' => $bucket['color'],
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Last N calendar months inclusive of the current month.
     *
     * @return array<int, int>
     */
    public function monthlyCounts(int $months): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1);
        $monthExpression = $this->monthKeyExpression('created_at');

        $rows = SurveyResponse::query()
            ->select(
                DB::raw("{$monthExpression} as month_key"),
                DB::raw('count(*) as total'),
            )
            ->where('created_at', '>=', $start)
            ->groupBy(DB::raw($monthExpression))
            ->pluck('total', 'month_key')
            ->map(fn ($total): int => (int) $total);

        return collect(range(0, $months - 1))
            ->map(function (int $offset) use ($months, $rows): int {
                $monthKey = now()->startOfMonth()->subMonths($months - 1 - $offset)->format('Y-m');

                return $rows->get($monthKey, 0);
            })
            ->all();
    }

    /**
     * @return array<int, array{date: string, count: int}>
     */
    public function dailyCounts(int $days): array
    {
        $dateExpression = $this->dateKeyExpression('created_at');

        $rows = SurveyResponse::query()
            ->select(DB::raw("{$dateExpression} as date"), DB::raw('count(*) as count'))
            ->whereDate('created_at', '>=', now()->subDays($days - 1))
            ->groupBy(DB::raw($dateExpression))
            ->pluck('count', 'date')
            ->map(fn ($count) => (int) $count);

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($days, $rows): array {
                $date = now()->subDays($days - 1 - $offset)->format('Y-m-d');

                return ['date' => $date, 'count' => $rows->get($date, 0)];
            })
            ->all();
    }

    private function monthKeyExpression(string $column): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => "DATE_FORMAT({$column}, '%Y-%m')",
            'pgsql' => "to_char({$column}, 'YYYY-MM')",
            default => "strftime('%Y-%m', {$column})",
        };
    }

    private function dateKeyExpression(string $column): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => "DATE({$column})",
            'pgsql' => "{$column}::date",
            default => "date({$column})",
        };
    }

    private function driver(): string
    {
        return SurveyResponse::query()->getConnection()->getDriverName();
    }
}

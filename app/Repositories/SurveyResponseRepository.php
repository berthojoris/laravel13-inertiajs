<?php

namespace App\Repositories;

use App\DTO\ReportPeriodData;
use App\DTO\SurveyResponseData;
use App\Models\SurveyResponse;
use Carbon\CarbonInterface;
use Illuminate\Database\Connection;
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
     * Average satisfaction score keyed by department value.
     *
     * @return array<string, float>
     */
    public function averageScoreByDepartment(): array
    {
        $averages = [];

        SurveyResponse::query()
            ->select('department', DB::raw('avg(satisfaction_score) as avg_score'))
            ->groupBy('department')
            ->get()
            ->each(function (SurveyResponse $row) use (&$averages): void {
                $averages[$row->department->value] = round((float) $row->getAttribute('avg_score'), 1);
            });

        return $averages;
    }

    /**
     * Response total keyed by channel value.
     *
     * @return array<string, int>
     */
    public function countByChannel(): array
    {
        $counts = [];

        SurveyResponse::query()
            ->select('channel', DB::raw('count(*) as total'))
            ->groupBy('channel')
            ->get()
            ->each(function (SurveyResponse $row) use (&$counts): void {
                $counts[$row->channel->value] = (int) $row->getAttribute('total');
            });

        return $counts;
    }

    /**
     * Response total keyed by raw satisfaction score (1-5).
     *
     * @return array<int, int>
     */
    public function countsBySatisfactionScore(): array
    {
        $counts = [];

        SurveyResponse::query()
            ->select('satisfaction_score', DB::raw('count(*) as total'))
            ->groupBy('satisfaction_score')
            ->get()
            ->each(function (SurveyResponse $row) use (&$counts): void {
                $counts[(int) $row->satisfaction_score] = (int) $row->getAttribute('total');
            });

        return $counts;
    }

    /**
     * Last N calendar months inclusive of the current month.
     *
     * @return array<int, int>
     */
    public function monthlyCounts(int $months): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1);

        $rows = SurveyResponse::query()
            ->selectRaw($this->monthKeySelectExpression())
            ->selectRaw('count(*) as total')
            ->where('created_at', '>=', $start)
            ->groupByRaw($this->monthKeyGroupExpression())
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
        $rows = SurveyResponse::query()
            ->selectRaw($this->dateKeySelectExpression())
            ->selectRaw('count(*) as count')
            ->whereDate('created_at', '>=', now()->subDays($days - 1))
            ->groupByRaw($this->dateKeyGroupExpression())
            ->pluck('count', 'date')
            ->map(fn ($count) => (int) $count);

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($days, $rows): array {
                $date = now()->subDays($days - 1 - $offset)->format('Y-m-d');

                return ['date' => $date, 'count' => $rows->get($date, 0)];
            })
            ->all();
    }

    /**
     * @return literal-string
     */
    private function monthKeySelectExpression(): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => "DATE_FORMAT(created_at, '%Y-%m') as month_key",
            'pgsql' => "to_char(created_at, 'YYYY-MM') as month_key",
            default => "strftime('%Y-%m', created_at) as month_key",
        };
    }

    /**
     * @return literal-string
     */
    private function monthKeyGroupExpression(): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => "DATE_FORMAT(created_at, '%Y-%m')",
            'pgsql' => "to_char(created_at, 'YYYY-MM')",
            default => "strftime('%Y-%m', created_at)",
        };
    }

    /**
     * @return literal-string
     */
    private function dateKeySelectExpression(): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => 'DATE(created_at) as date',
            'pgsql' => 'created_at::date as date',
            default => 'date(created_at) as date',
        };
    }

    /**
     * @return literal-string
     */
    private function dateKeyGroupExpression(): string
    {
        return match ($this->driver()) {
            'mysql', 'mariadb' => 'DATE(created_at)',
            'pgsql' => 'created_at::date',
            default => 'date(created_at)',
        };
    }

    private function driver(): string
    {
        $connection = SurveyResponse::query()->getConnection();

        return $connection instanceof Connection ? $connection->getDriverName() : '';
    }
}

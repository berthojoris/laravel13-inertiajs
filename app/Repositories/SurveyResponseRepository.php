<?php

namespace App\Repositories;

use App\DTO\ReportPeriodData;
use App\DTO\SurveyResponseData;
use App\Models\SurveyResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

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

    public function averageSatisfaction(): ?float
    {
        $average = SurveyResponse::query()->avg('satisfaction_score');

        return $average !== null ? (float) $average : null;
    }
}

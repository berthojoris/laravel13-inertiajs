<?php

namespace App\Repositories;

use App\DTO\SurveyExtraResponseData;
use App\Models\SurveyExtraResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class SurveyExtraResponseRepository
{
    public function create(SurveyExtraResponseData $data): SurveyExtraResponse
    {
        return SurveyExtraResponse::query()->create($data->toArray());
    }

    /**
     * @return LengthAwarePaginator<int, SurveyExtraResponse>
     */
    public function paginateFiltered(?string $search, int $perPage): LengthAwarePaginator
    {
        return SurveyExtraResponse::query()
            ->when(
                filled($search),
                fn ($query) => $query->whereHas('user', function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
            )
            ->latest()
            ->with('user')
            ->paginate($perPage)
            ->withQueryString();
    }
}

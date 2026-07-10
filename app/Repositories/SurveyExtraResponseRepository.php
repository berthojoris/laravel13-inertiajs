<?php

namespace App\Repositories;

use App\DTO\SurveyExtraResponseData;
use App\Models\SurveyExtraResponse;

class SurveyExtraResponseRepository
{
    public function create(SurveyExtraResponseData $data): SurveyExtraResponse
    {
        return SurveyExtraResponse::query()->create($data->toArray());
    }
}

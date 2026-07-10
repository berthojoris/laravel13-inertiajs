<?php

namespace App\Actions\Survey;

use App\DTO\SurveyExtraResponseData;
use App\Models\SurveyExtraResponse;
use App\Repositories\SurveyExtraResponseRepository;

class StoreSurveyExtraResponseAction
{
    public function __construct(private readonly SurveyExtraResponseRepository $repository) {}

    public function execute(SurveyExtraResponseData $data): SurveyExtraResponse
    {
        return $this->repository->create($data);
    }
}

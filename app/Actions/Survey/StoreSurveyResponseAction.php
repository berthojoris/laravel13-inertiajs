<?php

namespace App\Actions\Survey;

use App\DTO\SurveyResponseData;
use App\Models\SurveyResponse;
use App\Repositories\SurveyResponseRepository;

class StoreSurveyResponseAction
{
    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    public function execute(SurveyResponseData $data): SurveyResponse
    {
        return $this->repository->create($data);
    }
}

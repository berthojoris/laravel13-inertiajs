<?php

namespace App\Actions\Survey;

use App\Models\SurveyResponse;
use App\Repositories\SurveyResponseRepository;

class ToggleSurveyResponseArchiveAction
{
    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    public function execute(SurveyResponse $response, bool $archived): SurveyResponse
    {
        return $this->repository->setArchived($response, $archived);
    }
}

<?php

namespace App\Policies;

use App\Models\SurveyResponse;
use App\Models\User;

class SurveyResponsePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, SurveyResponse $surveyResponse): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function export(User $user): bool
    {
        return true;
    }

    public function update(User $user, SurveyResponse $surveyResponse): bool
    {
        return $user->id === $surveyResponse->user_id;
    }

    public function delete(User $user, SurveyResponse $surveyResponse): bool
    {
        return $user->id === $surveyResponse->user_id;
    }
}

<?php

namespace App\Policies;

use App\Models\SurveyExtraResponse;
use App\Models\User;

class SurveyExtraResponsePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, SurveyExtraResponse $surveyExtraResponse): bool
    {
        return true;
    }

    public function update(User $user, SurveyExtraResponse $surveyExtraResponse): bool
    {
        return $user->id === $surveyExtraResponse->user_id;
    }

    public function delete(User $user, SurveyExtraResponse $surveyExtraResponse): bool
    {
        return $user->id === $surveyExtraResponse->user_id;
    }
}

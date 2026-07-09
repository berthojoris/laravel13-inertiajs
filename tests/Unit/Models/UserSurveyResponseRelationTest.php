<?php

use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user has many survey responses', function () {
    $user = User::factory()->create();

    SurveyResponse::factory()->count(3)->create(['user_id' => $user->id]);

    expect($user->surveyResponses)->toHaveCount(3);
    expect($user->surveyResponses->first())->toBeInstanceOf(SurveyResponse::class);
});

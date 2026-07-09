<?php

use App\Models\SurveyResponse;
use App\Models\User;
use App\Policies\SurveyResponsePolicy;

test('authenticated users can view and create survey responses', function () {
    $user = User::factory()->make(['id' => 1]);
    $policy = new SurveyResponsePolicy;

    expect($policy->viewAny($user))->toBeTrue();
    expect($policy->create($user))->toBeTrue();
    expect($policy->export($user))->toBeTrue();
});

test('only the owner can update or delete a survey response', function () {
    $owner = User::factory()->make(['id' => 1]);
    $other = User::factory()->make(['id' => 2]);
    $response = SurveyResponse::factory()->make(['user_id' => 1]);
    $policy = new SurveyResponsePolicy;

    expect($policy->update($owner, $response))->toBeTrue();
    expect($policy->delete($owner, $response))->toBeTrue();
    expect($policy->update($other, $response))->toBeFalse();
    expect($policy->delete($other, $response))->toBeFalse();
});

<?php

use App\Models\SurveyExtraResponse;
use App\Models\User;
use App\Policies\SurveyExtraResponsePolicy;

test('authenticated users can view and create survey extra responses', function () {
    $user = User::factory()->make(['id' => 1]);
    $policy = new SurveyExtraResponsePolicy;

    expect($policy->viewAny($user))->toBeTrue();
    expect($policy->create($user))->toBeTrue();
});

test('any authenticated user can view a survey extra response', function () {
    $user = User::factory()->make(['id' => 2]);
    $response = SurveyExtraResponse::factory()->make(['user_id' => 1]);
    $policy = new SurveyExtraResponsePolicy;

    expect($policy->view($user, $response))->toBeTrue();
});

test('only the owner can update or delete a survey extra response', function () {
    $owner = User::factory()->make(['id' => 1]);
    $other = User::factory()->make(['id' => 2]);
    $response = SurveyExtraResponse::factory()->make(['user_id' => 1]);
    $policy = new SurveyExtraResponsePolicy;

    expect($policy->update($owner, $response))->toBeTrue();
    expect($policy->delete($owner, $response))->toBeTrue();
    expect($policy->update($other, $response))->toBeFalse();
    expect($policy->delete($other, $response))->toBeFalse();
});

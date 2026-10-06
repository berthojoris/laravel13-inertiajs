<?php

use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('owner can archive and restore a survey response', function () {
    $user = User::factory()->create();
    $response = SurveyResponse::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->put(route('survey-results.archive', ['response' => $response->id]), [
            'archived' => true,
        ])
        ->assertRedirect(route('survey-results.index'));

    expect($response->fresh()->archived_at)->not->toBeNull();

    $this->actingAs($user)
        ->put(route('survey-results.archive', ['response' => $response->id]), [
            'archived' => false,
        ])
        ->assertRedirect(route('survey-results.index'));

    expect($response->fresh()->archived_at)->toBeNull();
});

test('non-owner cannot archive a survey response', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $response = SurveyResponse::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($other)
        ->put(route('survey-results.archive', ['response' => $response->id]), [
            'archived' => true,
        ])
        ->assertForbidden();

    expect($response->fresh()->archived_at)->toBeNull();
});

test('archived flag is exposed on survey results page', function () {
    $user = User::factory()->create();
    SurveyResponse::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('survey-results.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('survey-results')
            ->has('responses.data', 1)
            ->where('responses.data.0.archived', false)
        );
});

test('archive request validates the archived field', function () {
    $user = User::factory()->create();
    $response = SurveyResponse::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson(route('survey-results.archive', ['response' => $response->id]), [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['archived']);
});

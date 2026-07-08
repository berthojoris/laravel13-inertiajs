<?php

use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('authenticated user can render survey pages', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('survey.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('survey'));

    $this->actingAs($user)
        ->get(route('survey-results.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('survey-results'));

    $this->actingAs($user)
        ->get(route('report.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('report'));
});

test('user can store survey response', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('survey.store'), [
        'respondent_name' => 'Ayu Lestari',
        'email' => 'ayu@example.com',
        'department' => 'Product',
        'satisfaction_score' => 5,
        'channel' => 'Website',
        'feedback' => 'Dashboard mudah digunakan.',
    ]);

    $response->assertRedirect(route('survey.create'));

    $this->assertDatabaseHas('survey_responses', [
        'user_id' => $user->id,
        'respondent_name' => 'Ayu Lestari',
        'email' => 'ayu@example.com',
    ]);
});

test('survey results can be searched', function () {
    $user = User::factory()->create();

    SurveyResponse::factory()->create([
        'user_id' => $user->id,
        'respondent_name' => 'Bima Pratama',
        'department' => 'Sales',
    ]);
    SurveyResponse::factory()->create([
        'user_id' => $user->id,
        'respondent_name' => 'Citra Dewi',
        'department' => 'Support',
    ]);

    $this->actingAs($user)
        ->get(route('survey-results.index', ['search' => 'Bima']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('survey-results')
            ->where('filters.search', 'Bima')
            ->where('responses.data.0.respondent_name', 'Bima Pratama')
            ->has('responses.data', 1)
        );
});

test('report export downloads excel file', function () {
    $user = User::factory()->create();
    SurveyResponse::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('report.export', [
            'start_date' => now()->subDay()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
        ]))
        ->assertOk()
        ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
});

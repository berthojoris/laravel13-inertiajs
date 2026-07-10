<?php

use App\Models\SurveyExtraResponse;
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
        ->get(route('survey-extra.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('survey-extra'));

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

test('user can store survey extra response', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('survey-extra.store'), [
        'q1' => 'Ayu Lestari',
        'q2' => 'sales',
        'q3' => ['speed', 'accuracy'],
        'q4' => 'yes',
        'q5' => 'Approval terlalu lama.',
        'q6' => 'daily',
        'q7' => ['web', 'email'],
        'q8' => 'easy',
        'q9' => 'Dashboard report harian',
        'q10' => 'high',
        'q11' => ['training', 'automation'],
        'q12' => 'chat',
        'q13' => 'Tambahkan notifikasi SLA.',
        'q14' => 'three_months',
        'q15' => ['quality', 'time'],
    ]);

    $response->assertRedirect(route('survey-extra.create'));

    $extraResponse = SurveyExtraResponse::query()->firstOrFail();

    expect($extraResponse->user_id)->toBe($user->id)
        ->and($extraResponse->answers['q1'])->toBe('Ayu Lestari')
        ->and($extraResponse->answers['q3'])->toBe(['speed', 'accuracy'])
        ->and($extraResponse->answers['q15'])->toBe(['quality', 'time']);
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

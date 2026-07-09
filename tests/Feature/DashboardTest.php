<?php

use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('metrics', 4)
            ->has('monthlyResponses', 8)
            ->has('satisfactionSplit')
            ->has('channelData')
            ->has('departmentScores')
            ->has('departmentAverages')
            ->has('dailyActivity', 14)
            ->where('completionRate', 0)
            ->where('metrics.0.value', 0)
        );
});

test('dashboard reflects live survey aggregates', function () {
    $user = User::factory()->create();

    SurveyResponse::factory()->create([
        'user_id' => $user->id,
        'satisfaction_score' => 5,
        'channel' => 'Website',
        'department' => 'Product',
        'feedback' => 'Great experience',
        'created_at' => now(),
    ]);
    SurveyResponse::factory()->create([
        'user_id' => $user->id,
        'satisfaction_score' => 3,
        'channel' => 'Email',
        'department' => 'Sales',
        'feedback' => null,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('metrics.0.value', 2)
            ->where('metrics.1.value', '4.0')
            ->where('completionRate', 50)
            ->where('metrics.2.value', '50%')
        );
});

<?php

namespace Database\Seeders;

use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Database\Seeder;

class SurveyResponseSeeder extends Seeder
{
    /**
     * Seed survey responses for local/demo dashboards.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        SurveyResponse::factory()
            ->count(80)
            ->create([
                'user_id' => $user->id,
            ]);
    }
}

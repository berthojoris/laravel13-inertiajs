<?php

namespace Database\Factories;

use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Models\SurveyResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyResponse>
 */
class SurveyResponseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'respondent_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'department' => fake()->randomElement(Department::cases()),
            'satisfaction_score' => fake()->numberBetween(1, 5),
            'channel' => fake()->randomElement(SurveyChannel::cases()),
            'feedback' => fake()->sentence(12),
            'created_at' => fake()->dateTimeBetween('-90 days', 'now'),
            'updated_at' => now(),
        ];
    }
}

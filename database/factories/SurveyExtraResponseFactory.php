<?php

namespace Database\Factories;

use App\Models\SurveyExtraResponse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyExtraResponse>
 */
class SurveyExtraResponseFactory extends Factory
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
            'answers' => [
                'q1' => fake()->name(),
                'q2' => fake()->randomElement(['sales', 'support', 'operations']),
                'q3' => fake()->randomElements(['speed', 'accuracy', 'communication'], 2),
                'q4' => fake()->randomElement(['yes', 'no']),
            ],
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'updated_at' => now(),
        ];
    }
}

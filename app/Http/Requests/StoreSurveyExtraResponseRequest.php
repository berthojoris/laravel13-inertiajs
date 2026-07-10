<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSurveyExtraResponseRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'q1' => ['required', 'string', 'max:255'],
            'q2' => ['required', Rule::in(['sales', 'support', 'operations', 'finance'])],
            'q3' => ['required', 'array', 'min:1'],
            'q3.*' => ['string', Rule::in(['speed', 'accuracy', 'communication', 'documentation'])],
            'q4' => ['required', Rule::in(['yes', 'no'])],
            'q5' => ['required', 'string', 'max:500'],
            'q6' => ['required', Rule::in(['daily', 'weekly', 'monthly', 'rarely'])],
            'q7' => ['required', 'array', 'min:1'],
            'q7.*' => ['string', Rule::in(['web', 'mobile', 'email', 'phone'])],
            'q8' => ['required', Rule::in(['very_easy', 'easy', 'neutral', 'hard'])],
            'q9' => ['required', 'string', 'max:255'],
            'q10' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'q11' => ['required', 'array', 'min:1'],
            'q11.*' => ['string', Rule::in(['training', 'automation', 'reporting', 'integration'])],
            'q12' => ['required', Rule::in(['email', 'chat', 'meeting', 'dashboard'])],
            'q13' => ['required', 'string', 'max:500'],
            'q14' => ['required', Rule::in(['one_month', 'three_months', 'six_months', 'one_year'])],
            'q15' => ['required', 'array', 'min:1'],
            'q15.*' => ['string', Rule::in(['quality', 'cost', 'time', 'experience'])],
        ];
    }
}

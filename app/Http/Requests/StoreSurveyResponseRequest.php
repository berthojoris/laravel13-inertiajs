<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSurveyResponseRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'respondent_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'department' => ['required', Rule::in(['Operations', 'Sales', 'Marketing', 'Product', 'Support'])],
            'satisfaction_score' => ['required', 'integer', 'between:1,5'],
            'channel' => ['required', Rule::in(['Website', 'Email', 'WhatsApp', 'Walk-in'])],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

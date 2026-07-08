<?php

namespace App\Http\Resources;

use App\Models\SurveyResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SurveyResponse
 */
class SurveyResponseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'respondent_name' => $this->respondent_name,
            'email' => $this->email,
            'department' => $this->department->value,
            'satisfaction_score' => $this->satisfaction_score,
            'channel' => $this->channel->value,
            'feedback' => $this->feedback,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}

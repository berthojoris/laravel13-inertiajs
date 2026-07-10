<?php

namespace App\Http\Resources;

use App\Models\SurveyExtraResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SurveyExtraResponse
 */
class SurveyExtraResponseResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_name' => $this->user?->name,
            'user_email' => $this->user?->email,
            'answers' => $this->answers,
            'created_at' => $this->created_at?->format('d M Y'),
        ];
    }
}

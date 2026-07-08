<?php

namespace App\DTO;

use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Http\Requests\StoreSurveyResponseRequest;

class SurveyResponseData
{
    public function __construct(
        public readonly int $userId,
        public readonly string $respondentName,
        public readonly string $email,
        public readonly Department $department,
        public readonly int $satisfactionScore,
        public readonly SurveyChannel $channel,
        public readonly ?string $feedback,
    ) {}

    public static function fromRequest(StoreSurveyResponseRequest $request): self
    {
        /** @var array{respondent_name: string, email: string, department: string, satisfaction_score: int, channel: string, feedback: string|null} $validated */
        $validated = $request->validated();

        return new self(
            userId: (int) $request->user()->id,
            respondentName: $validated['respondent_name'],
            email: $validated['email'],
            department: Department::from($validated['department']),
            satisfactionScore: (int) $validated['satisfaction_score'],
            channel: SurveyChannel::from($validated['channel']),
            feedback: $validated['feedback'] ?? null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'respondent_name' => $this->respondentName,
            'email' => $this->email,
            'department' => $this->department,
            'satisfaction_score' => $this->satisfactionScore,
            'channel' => $this->channel,
            'feedback' => $this->feedback,
        ];
    }
}

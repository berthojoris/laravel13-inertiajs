<?php

namespace App\DTO;

use App\Http\Requests\StoreSurveyExtraResponseRequest;

readonly class SurveyExtraResponseData
{
    /**
     * @param  array<string, mixed>  $answers
     */
    public function __construct(
        public int $userId,
        public array $answers,
    ) {}

    public static function fromRequest(StoreSurveyExtraResponseRequest $request): self
    {
        return new self(
            userId: $request->user()->id,
            answers: $request->validated(),
        );
    }

    /**
     * @return array{user_id: int, answers: array<string, mixed>}
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'answers' => $this->answers,
        ];
    }
}

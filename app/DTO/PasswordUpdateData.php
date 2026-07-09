<?php

namespace App\DTO;

use App\Http\Requests\Settings\PasswordUpdateRequest;

class PasswordUpdateData
{
    public function __construct(
        public readonly string $password,
    ) {}

    public static function fromRequest(PasswordUpdateRequest $request): self
    {
        /** @var array{password: string} $validated */
        $validated = $request->validated();

        return new self(
            password: $validated['password'],
        );
    }
}

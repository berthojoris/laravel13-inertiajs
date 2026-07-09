<?php

namespace App\DTO;

use App\Http\Requests\Settings\ProfileUpdateRequest;

class ProfileUpdateData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
    ) {}

    public static function fromRequest(ProfileUpdateRequest $request): self
    {
        /** @var array{name: string, email: string} $validated */
        $validated = $request->validated();

        return new self(
            name: $validated['name'],
            email: $validated['email'],
        );
    }
}

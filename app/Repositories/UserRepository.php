<?php

namespace App\Repositories;

use App\DTO\PasswordUpdateData;
use App\DTO\ProfileUpdateData;
use App\Models\User;

class UserRepository
{
    public function updateProfile(User $user, ProfileUpdateData $data): User
    {
        $user->fill([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return $user;
    }

    public function updatePassword(User $user, PasswordUpdateData $data): User
    {
        $user->update([
            'password' => $data->password,
        ]);

        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
    }

    /**
     * @return list<array{id: int|string, name: string, authenticator: mixed, created_at_diff: string, last_used_at_diff: string|null}>
     */
    public function listPasskeysForSecurity(User $user): array
    {
        return $user->passkeys()
            ->select(['id', 'name', 'credential', 'created_at', 'last_used_at'])
            ->latest()
            ->get()
            ->map(fn ($passkey): array => [
                'id' => $passkey->id,
                'name' => $passkey->name,
                'authenticator' => $passkey->authenticator,
                'created_at_diff' => $passkey->created_at->diffForHumans(),
                'last_used_at_diff' => $passkey->last_used_at?->diffForHumans(),
            ])
            ->values()
            ->all();
    }
}

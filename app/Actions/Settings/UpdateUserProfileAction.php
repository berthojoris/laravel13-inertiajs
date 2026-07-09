<?php

namespace App\Actions\Settings;

use App\DTO\ProfileUpdateData;
use App\Models\User;
use App\Repositories\UserRepository;

class UpdateUserProfileAction
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    public function execute(User $user, ProfileUpdateData $data): User
    {
        return $this->repository->updateProfile($user, $data);
    }
}

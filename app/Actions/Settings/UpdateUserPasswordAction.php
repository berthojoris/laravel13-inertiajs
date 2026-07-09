<?php

namespace App\Actions\Settings;

use App\DTO\PasswordUpdateData;
use App\Models\User;
use App\Repositories\UserRepository;

class UpdateUserPasswordAction
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    public function execute(User $user, PasswordUpdateData $data): User
    {
        return $this->repository->updatePassword($user, $data);
    }
}

<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeleteUserAccountAction
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    public function execute(User $user, Request $request): void
    {
        Auth::logout();

        $this->repository->delete($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}

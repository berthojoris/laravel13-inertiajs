<?php

use App\Actions\Settings\DeleteUserAccountAction;
use App\Actions\Settings\UpdateUserPasswordAction;
use App\Actions\Settings\UpdateUserProfileAction;
use App\DTO\PasswordUpdateData;
use App\DTO\ProfileUpdateData;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('update user profile action updates name and email', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $action = new UpdateUserProfileAction(new UserRepository);
    $action->execute($user, new ProfileUpdateData('New Name', 'new@example.com'));

    $user->refresh();

    expect($user->name)->toBe('New Name');
    expect($user->email)->toBe('new@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('update user password action hashes the new password', function () {
    $user = User::factory()->create();

    $action = new UpdateUserPasswordAction(new UserRepository);
    $action->execute($user, new PasswordUpdateData('new-secret-password'));

    expect(Hash::check('new-secret-password', $user->refresh()->password))->toBeTrue();
});

test('delete user account action logs out and deletes the user', function () {
    $user = User::factory()->create();
    Auth::login($user);

    $request = Request::create('/settings/profile', 'DELETE');
    $request->setLaravelSession(app('session.store'));

    $action = new DeleteUserAccountAction(new UserRepository);
    $action->execute($user, $request);

    expect(Auth::guest())->toBeTrue();
    expect($user->fresh())->toBeNull();
});

<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('pdf.demo'))->assertRedirect(route('login'));
});

test('authenticated users can download the demo pdf', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('pdf.demo'));

    $response
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf')
        ->assertDownload('laporan-demo.pdf');

    expect(substr((string) $response->getContent(), 0, 4))->toBe('%PDF');
});

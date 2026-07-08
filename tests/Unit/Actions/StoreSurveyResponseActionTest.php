<?php

use App\Actions\Survey\StoreSurveyResponseAction;
use App\DTO\SurveyResponseData;
use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Models\SurveyResponse;
use App\Repositories\SurveyResponseRepository;

beforeEach(function () {
    $this->repository = Mockery::mock(SurveyResponseRepository::class);
    $this->action = new StoreSurveyResponseAction($this->repository);
});

afterEach(function () {
    Mockery::close();
});

test('execute delegates to repository and returns the created model', function () {
    $data = new SurveyResponseData(
        userId: 1,
        respondentName: 'Budi Santoso',
        email: 'budi@example.com',
        department: Department::Product,
        satisfactionScore: 5,
        channel: SurveyChannel::Website,
        feedback: 'Mantap',
    );

    $created = Mockery::mock(SurveyResponse::class);

    $this->repository->shouldReceive('create')
        ->once()
        ->with(Mockery::on(fn (SurveyResponseData $arg) => $arg === $data))
        ->andReturn($created);

    expect($this->action->execute($data))->toBe($created);
});

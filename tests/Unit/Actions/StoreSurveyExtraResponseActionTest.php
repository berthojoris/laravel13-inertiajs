<?php

use App\Actions\Survey\StoreSurveyExtraResponseAction;
use App\DTO\SurveyExtraResponseData;
use App\Models\SurveyExtraResponse;
use App\Repositories\SurveyExtraResponseRepository;

beforeEach(function () {
    $this->repository = Mockery::mock(SurveyExtraResponseRepository::class);
    $this->action = new StoreSurveyExtraResponseAction($this->repository);
});

afterEach(function () {
    Mockery::close();
});

test('execute delegates to repository and returns the created survey extra response', function () {
    $data = new SurveyExtraResponseData(
        userId: 1,
        answers: [
            'q1' => 'Ayu Lestari',
            'q2' => 'sales',
            'q3' => ['speed', 'accuracy'],
            'q4' => 'yes',
        ],
    );

    $created = Mockery::mock(SurveyExtraResponse::class);

    $this->repository->shouldReceive('create')
        ->once()
        ->with(Mockery::on(fn (SurveyExtraResponseData $arg) => $arg === $data))
        ->andReturn($created);

    expect($this->action->execute($data))->toBe($created);
});

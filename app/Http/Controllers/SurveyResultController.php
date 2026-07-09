<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyResponseResource;
use App\Models\SurveyResponse;
use App\Repositories\SurveyResponseRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyResultController extends Controller
{
    private const PER_PAGE = 5;

    public function __construct(
        private readonly SurveyResponseRepository $repository,
    ) {}

    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', SurveyResponse::class);

        $search = (string) $request->query('search', '');

        $responses = $this->repository->paginateFiltered($search, self::PER_PAGE)
            ->through(fn (SurveyResponse $response) => (new SurveyResponseResource($response))->resolve());

        return Inertia::render('survey-results', [
            'responses' => $responses,
            'filters' => ['search' => $search],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyExtraResponseResource;
use App\Models\SurveyExtraResponse;
use App\Repositories\SurveyExtraResponseRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyExtraResultController extends Controller
{
    private const PER_PAGE = 5;

    public function __construct(
        private readonly SurveyExtraResponseRepository $repository,
    ) {}

    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', SurveyExtraResponse::class);

        $search = (string) $request->query('search', '');

        $responses = $this->repository->paginateFiltered($search, self::PER_PAGE)
            ->through(fn (SurveyExtraResponse $response) => (new SurveyExtraResponseResource($response))->resolve());

        return Inertia::render('survey-extra-results', [
            'responses' => $responses,
            'filters' => ['search' => $search],
        ]);
    }
}

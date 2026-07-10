<?php

namespace App\Http\Controllers;

use App\Actions\Survey\StoreSurveyExtraResponseAction;
use App\DTO\SurveyExtraResponseData;
use App\Http\Requests\StoreSurveyExtraResponseRequest;
use App\Models\SurveyExtraResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SurveyExtraController extends Controller
{
    public function create(): Response
    {
        $this->authorize('create', SurveyExtraResponse::class);

        return Inertia::render('survey-extra');
    }

    public function store(StoreSurveyExtraResponseRequest $request, StoreSurveyExtraResponseAction $action): RedirectResponse
    {
        $this->authorize('create', SurveyExtraResponse::class);

        $action->execute(SurveyExtraResponseData::fromRequest($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Survey extra response saved.')]);

        return to_route('survey-extra.create');
    }
}

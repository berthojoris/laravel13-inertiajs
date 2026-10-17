<?php

namespace App\Http\Controllers;

use App\Actions\Survey\StoreSurveyResponseAction;
use App\DTO\SurveyResponseData;
use App\Enums\Department;
use App\Enums\SurveyChannel;
use App\Http\Requests\StoreSurveyResponseRequest;
use App\Models\SurveyResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    public function create(): Response
    {
        $this->authorize('create', SurveyResponse::class);

        return Inertia::render('survey', [
            'departments' => Inertia::once(
                static fn (): array => array_map(
                    static fn (Department $department): string => $department->value,
                    Department::cases(),
                ),
            ),
            'channels' => Inertia::once(
                static fn (): array => array_map(
                    static fn (SurveyChannel $channel): string => $channel->value,
                    SurveyChannel::cases(),
                ),
            ),
        ]);
    }

    public function store(StoreSurveyResponseRequest $request, StoreSurveyResponseAction $action): RedirectResponse
    {
        $this->authorize('create', SurveyResponse::class);

        $action->execute(SurveyResponseData::fromRequest($request));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Survey response saved.')]);

        return to_route('survey.create');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\SurveyResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SurveyResultController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = (string) $request->query('search', '');

        $responses = SurveyResponse::query()
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('respondent_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('channel', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (SurveyResponse $response) => [
                'id' => $response->id,
                'respondent_name' => $response->respondent_name,
                'email' => $response->email,
                'department' => $response->department,
                'satisfaction_score' => $response->satisfaction_score,
                'channel' => $response->channel,
                'feedback' => $response->feedback,
                'created_at' => $response->created_at?->format('d M Y'),
            ]);

        return Inertia::render('survey-results', [
            'responses' => $responses,
            'filters' => ['search' => $search],
        ]);
    }
}

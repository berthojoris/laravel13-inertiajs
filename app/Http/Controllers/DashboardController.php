<?php

namespace App\Http\Controllers;

use App\Models\SurveyResponse;
use App\Services\DashboardMetricsService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardMetricsService $metrics,
    ) {}

    public function __invoke(): Response
    {
        $this->authorize('viewAny', SurveyResponse::class);

        return Inertia::render('dashboard', $this->metrics->build());
    }
}

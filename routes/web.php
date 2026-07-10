<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\SurveyExtraController;
use App\Http\Controllers\SurveyExtraResultController;
use App\Http\Controllers\SurveyResultController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('survey', [SurveyController::class, 'create'])->name('survey.create');
    Route::post('survey', [SurveyController::class, 'store'])->name('survey.store');
    Route::get('survey-extra', [SurveyExtraController::class, 'create'])->name('survey-extra.create');
    Route::post('survey-extra', [SurveyExtraController::class, 'store'])->name('survey-extra.store');
    Route::get('survey-results', SurveyResultController::class)->name('survey-results.index');
    Route::get('survey-extra-results', SurveyExtraResultController::class)->name('survey-extra-results.index');
    Route::get('report', [ReportController::class, 'index'])->name('report.index');
    Route::get('report/export', [ReportController::class, 'export'])->name('report.export');
});

require __DIR__.'/settings.php';

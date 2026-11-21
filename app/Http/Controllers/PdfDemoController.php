<?php

namespace App\Http\Controllers;

use App\Actions\Pdf\GenerateDemoPdfAction;
use Illuminate\Http\Response;

class PdfDemoController extends Controller
{
    public function __invoke(GenerateDemoPdfAction $action): Response
    {
        return $action->execute();
    }
}

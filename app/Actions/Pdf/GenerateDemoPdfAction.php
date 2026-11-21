<?php

namespace App\Actions\Pdf;

use Fagus\Laravel\PdfFactory;
use Illuminate\Http\Response;

class GenerateDemoPdfAction
{
    public function __construct(
        private readonly PdfFactory $fagus,
    ) {}

    public function execute(): Response
    {
        return $this->fagus
            ->view('pdf.demo')
            ->name('laporan-demo.pdf')
            ->download();
    }
}

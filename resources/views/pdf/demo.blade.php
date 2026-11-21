<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Demo PDF</title>
    <style>
        @page {
            size: A4;
            margin: 16mm 15mm 26mm;

            @bottom-left {
                content: "Laravel Inertia — dirender dengan Fagus";
                font-size: 8.5pt;
                color: #9ca3af;
            }

            @bottom-right {
                content: "Halaman " counter(page) " dari " counter(pages);
                font-size: 8.5pt;
                color: #9ca3af;
            }
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Inter, sans-serif;
            font-size: 10.5pt;
            line-height: 1.65;
            color: #1f2937;
        }

        .brandbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 6mm;
            border-bottom: 1px solid #e5e7eb;
        }

        .brand {
            font-size: 13pt;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .brand span {
            color: #4f46e5;
        }

        .badge {
            padding: 1mm 3.5mm;
            border: 1px solid #4f46e5;
            border-radius: 999px;
            color: #4f46e5;
            font-size: 8.5pt;
            font-weight: 600;
        }

        h1 {
            margin: 8mm 0 1.5mm;
            font-size: 20pt;
            line-height: 1.25;
        }

        .subtitle {
            margin: 0;
            color: #6b7280;
            font-size: 10pt;
        }

        .meta {
            display: flex;
            gap: 12mm;
            margin: 7mm 0 0;
            padding: 4mm 0;
            border-top: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
        }

        .meta > div {
            flex: 1;
        }

        .meta-label {
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #9ca3af;
            margin-bottom: 0.5mm;
        }

        .meta-value {
            font-weight: 600;
        }

        h2 {
            margin: 9mm 0 3mm;
            font-size: 12.5pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
        }

        th {
            text-align: left;
            padding: 2.5mm 3mm;
            background: #f9fafb;
            border-bottom: 1px solid #d1d5db;
            font-size: 8.5pt;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #6b7280;
        }

        td {
            padding: 2.5mm 3mm;
            border-bottom: 1px solid #e5e7eb;
        }

        .amount {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        tfoot td {
            border-bottom: none;
            padding-top: 3.5mm;
        }

        .total-row td {
            border-top: 1px solid #1f2937;
            border-bottom: none;
            font-weight: 700;
        }

        .note {
            margin: 8mm 0 0;
            padding: 4mm 5mm;
            border: 1px solid #e5e7eb;
            border-radius: 2mm;
            background: #f9fafb;
            color: #6b7280;
            font-size: 9.5pt;
        }

        code {
            font-family: monospace;
            font-size: 9pt;
        }

        .closing {
            margin: 7mm 0 0;
        }

        .signature {
            margin-top: 12mm;
            display: flex;
            justify-content: flex-end;
        }

        .signature-line {
            width: 45mm;
            height: 10mm;
            border-bottom: 1px solid #1f2937;
        }

        .signature-name {
            margin-top: 1.5mm;
            font-weight: 600;
            font-size: 9.5pt;
            text-align: center;
        }
    </style>
</head>
<body>
    <header class="brandbar">
        <div class="brand">Laravel <span>Inertia</span> Studio</div>
        <div class="badge">Dokumen Demo</div>
    </header>

    <h1>Laporan Demo PDF</h1>
    <p class="subtitle">
        Halaman sederhana yang dirender menjadi PDF oleh Fagus — tanpa browser, langsung dari Blade view.
    </p>

    <section class="meta">
        <div>
            <div class="meta-label">Nomor Dokumen</div>
            <div class="meta-value">DEMO-2026-001</div>
        </div>
        <div>
            <div class="meta-label">Tanggal Dibuat</div>
            <div class="meta-value">{{ now()->format('d/m/Y') }}</div>
        </div>
        <div>
            <div class="meta-label">Disusun Oleh</div>
            <div class="meta-value">Tim Produk</div>
        </div>
    </section>

    <h2>Rincian Layanan</h2>
    <table>
        <thead>
            <tr>
                <th>Deskripsi</th>
                <th class="amount">Qty</th>
                <th class="amount">Harga Satuan</th>
                <th class="amount">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Desain ulang halaman dashboard</td>
                <td class="amount">1</td>
                <td class="amount">Rp 4.500.000</td>
                <td class="amount">Rp 4.500.000</td>
            </tr>
            <tr>
                <td>Integrasi ekspor PDF (Fagus)</td>
                <td class="amount">1</td>
                <td class="amount">Rp 3.800.000</td>
                <td class="amount">Rp 3.800.000</td>
            </tr>
            <tr>
                <td>Pengujian otomatis (Pest)</td>
                <td class="amount">2</td>
                <td class="amount">Rp 1.000.000</td>
                <td class="amount">Rp 2.000.000</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="amount">Subtotal</td>
                <td class="amount">Rp 10.300.000</td>
            </tr>
            <tr>
                <td colspan="3" class="amount">Pajak (11%)</td>
                <td class="amount">Rp 1.133.000</td>
            </tr>
            <tr class="total-row">
                <td colspan="3" class="amount">Total</td>
                <td class="amount">Rp 11.433.000</td>
            </tr>
        </tfoot>
    </table>

    <p class="closing">
        Dokumen ini adalah contoh untuk memverifikasi integrasi Fagus di project ini.
    </p>

    <div class="note">
        Catatan: ukuran kertas A4, margin, dan nomor halaman di footer diatur lewat
        aturan <code>@page</code> pada CSS, sama seperti saat mencetak dari Chrome.
    </div>

    <div class="signature">
        <div>
            <div class="signature-line"></div>
            <div class="signature-name">Andi Pratama</div>
        </div>
    </div>
</body>
</html>

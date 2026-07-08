# Laravel React Starter Kit — Survey Analytics

A Laravel 13 + React 19 + Inertia.js v3 application with a built-in Survey Analytics feature set (dashboard charts, survey form, results datatable, Excel report export).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Laravel 13 |
| Frontend | React 19, Inertia.js v3, TypeScript, Vite |
| Styling | Tailwind CSS v4 (shadcn/ui — Radix UI primitives) |
| Database | SQLite |
| Auth | Laravel Fortify + Passkeys |
| Routing | Wayfinder (typed route helpers) |
| Export | Maatwebsite Excel 3 |
| Charts | Custom SVG (no external library) |

## Features

### Survey Analytics (built on top of the starter kit)

- **Dashboard** — Metric cards (total responses, avg satisfaction, completion rate, reports generated), line chart (monthly trend), pie chart (satisfaction split), bar chart (channel performance), radar chart (department scores).
- **Survey Form** — Collects respondent name, email, department, satisfaction score (1–5), channel, and feedback. Resets after submission. Spinner + loading state on submit. Toast notification on success.
- **Survey Results** — Paginated datatable (5 per page) with search across name, email, department, and channel.
- **Report Export** — Date range picker → generates `.xlsx` via Laravel Excel.

### Starter Kit Included

- Authentication (email/password + passkeys + two-factor authentication)
- Email verification
- Profile management
- Appearance toggle (light / dark / system)
- Back-history prevention middleware (logout security)
- Typed route helpers via Wayfinder

## Architecture

The project follows **Layered Architecture** as defined in `AGENTS.md`. Every business logic lives outside controllers.

```
app/
├── Actions/          # One use case per class, method execute(...)
├── Services/         # Reusable business logic
├── Repositories/     # All Eloquent / Query Builder access
├── DTO/              # Data Transfer Objects
├── Enums/            # PHP Enums for type-safe values
├── Exports/          # Laravel Excel export classes
├── Http/
│   ├── Controllers/  # Thin — validate, call Action, return
│   ├── Requests/     # FormRequest validation
│   └── Resources/    # API Resource transformers
└── Models/           # Persistence only
```

Frontend follows the same separation: types in `resources/js/types`, constants in `resources/js/lib`, shared UI in `resources/js/components`.

## Pages

| Route | Page | Description |
|---|---|---|
| `/dashboard` | Dashboard | Analytics overview with charts |
| `/survey` | Survey | Input form for survey responses |
| `/survey-results` | Survey Results | Paginated datatable with search |
| `/report` | Report | Date range picker → Excel export |

## Setup

```bash
# 1. Install dependencies
composer install
npm install

# 2. Create environment file
cp .env.example .env
php artisan key:generate

# 3. Run migrations + seeders (optional)
php artisan migrate
php artisan db:seed   # optional

# 4. Start dev server
npm run dev
php artisan serve
```

## Code Quality

```bash
# Lint (Pint + ESLint)
composer lint
npm run lint

# Type check (PHPStan + TypeScript)
composer types:check
npm run types:check

# All checks (CI simulation)
composer test

# Build for production
npm run build
```

## Testing

```bash
php artisan test
```

Feature tests include: survey workflow (render, store, search, Excel export), authentication, email verification, profile/security settings.

## Environment Variables

```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_URL=http://localhost

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

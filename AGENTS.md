# AGENTS.md — AI Development Guidelines

This repository is maintained by humans and AI coding agents. Every rule below is mandatory for this **Laravel 13 + Inertia.js v3** app.

> Prefer maintainability over cleverness or fewer lines of code.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP ^8.3, Laravel 13 |
| Frontend | React 19, Inertia.js v3, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Auth | Laravel Fortify + Passkeys + 2FA |
| Routing | Wayfinder (typed route helpers) |
| Database | SQLite (default); queue/cache use `database` drivers |
| Export | Maatwebsite Excel (`app/Exports`) |
| Quality | Pest, Pint, Larastan/PHPStan, ESLint, Prettier |

---

## Architecture — Layered

Business logic must **not** live in Controllers, Models, Middleware, Routes, or Fortify view wiring. Put it in **Actions** and/or **Services**. All Eloquent access goes through **Repositories**.

### Data flow

```text
Write / command:
  Controller → authorize → FormRequest → Action → Repository → Model
  (DTO between Request and Action)

Read / query:
  Controller → authorize → Service and/or Repository → Inertia props
  (Action optional for simple reads)
```

Do **not** invent a Service when an Action + Repository is enough. Do **not** invent an Action for a thin read that only paginates or builds metrics.

### Directory structure (actual)

```text
app/
├── Actions/           # One use case per class; execute(...)
│   ├── Fortify/       # Fortify contracts (exception to FormRequest rule)
│   ├── Settings/
│   └── Survey/
├── Concerns/          # Shared validation rule traits
├── DTO/               # *Data value objects
├── Enums/
├── Exports/           # Laravel Excel export classes
├── Http/
│   ├── Controllers/   # Thin: authorize, call Action/Service, return
│   ├── Middleware/    # Includes HandleInertiaRequests (shared props)
│   ├── Requests/      # FormRequest
│   └── Resources/     # Transform models for Inertia props when useful
├── Models/
├── Policies/          # Mandatory for domain resources
├── Providers/
├── Repositories/      # All Eloquent / Query Builder
└── Services/          # Reusable domain logic (e.g. dashboard metrics)
```

Create `Exceptions/`, `Jobs/`, `Events/`, etc. only when the feature needs them (YAGNI).

---

## Backend

### Controllers

Controllers **must only**: authorize, accept a FormRequest (when input exists), call an Action or Service, return a redirect / Inertia response / download.

Controllers **must never**: query Eloquent directly, contain business logic, or grow into “god” classes.

```php
// Good — authorize, then Action + DTO
public function store(
    StoreSurveyResponseRequest $request,
    StoreSurveyResponseAction $action,
): RedirectResponse {
    $this->authorize('create', SurveyResponse::class);
    $action->execute(SurveyResponseData::fromRequest($request));

    return to_route('survey.create');
}
```

Base `Controller` uses `AuthorizesRequests`.

### Actions

- One use case per class.
- One public method: `execute(...)`.
- No static methods.
- Receive DTOs (or primitives), not raw `Request` — except when session/auth side effects truly need the request (e.g. logout + invalidate session). Prefer extracting only what is needed.

### Services

Reusable domain logic that may call one or more repositories (example: `DashboardMetricsService`). Not required on every path.

### Repositories

All Eloquent / Query Builder access lives here. Controllers must never use Eloquent directly.

### Models

Persistence only: relationships, scopes, casts, accessors/mutators, factories.

Keep inverse relations complete when FKs exist (e.g. `User::surveyResponses()` and `SurveyResponse::user()`).

### Validation

App routes: always `FormRequest`. Never `$request->validate()` inside a controller.

**Fortify exception:** `app/Actions/Fortify/*` may use `Validator::make` to satisfy Fortify contracts. Do not force FormRequest into Fortify Actions.

Shared rule sets belong in `app/Concerns/` (e.g. `ProfileValidationRules`).

### Read/query requests

For simple read-only filters (`search`, `page`, `sort`) controllers may accept `Illuminate\Http\Request` and extract query parameters directly.

Use a `FormRequest` and DTO when query parameters:

- require validation beyond simple casting/defaults
- include date ranges, enums, arrays, or multiple filters
- are reused by an Action/Service/Export
- affect authorization-sensitive data

Even for read queries, controllers must not query Eloquent directly. Use a Repository or Service.

### Authorization — Policies are mandatory

**Authorization Policies are a must** for every domain resource that has routes (viewAny, create, update, delete, export, …). `auth` / `verified` middleware alone is **not** enough.

**Required:**

- Policy at `app/Policies/{Model}Policy.php`
- `$this->authorize(...)` (or `Gate::authorize`) in the controller **before** Actions / Services
- Unit tests for non-trivial ownership / ability rules

**Forbidden:**

- Shipping feature routes with only `auth` / `verified` and no Policy
- Manual permission `if` checks scattered in controllers

```php
$this->authorize('create', SurveyResponse::class);
$this->authorize('export', SurveyResponse::class);
$this->authorize('viewAny', SurveyResponse::class);
```

**Own-account settings** (profile / password) still go through FormRequest + Actions. Prefer a `UserPolicy` (or equivalent Gate) when settings grow beyond “edit self”; until then, keep settings thin and never put Eloquent in those controllers.

Use Gates only for cross-cutting abilities not tied to a single model.

### DTO

Pass structured data via `*Data` objects. Never pass a raw `Request` into Services.

```php
$action->execute(SurveyResponseData::fromRequest($request));
```

### Enums

Use PHP Enums for fixed domain values. Never magic strings for departments, channels, statuses, etc.

### Database

Always Migration + Factory (+ Seeder when demo/local data matters). Prefer Query Builder / Eloquent via Repository over raw SQL.

### Inertia responses & Resources

Prefer `Http\Resources\*` when shaping model collections for pages (example: survey results). Dashboard aggregates may return plain arrays from a Service.

Flash user feedback with:

```php
Inertia::flash('toast', ['type' => 'success', 'message' => __('Saved.')]);
```

Shared props live in `HandleInertiaRequests` (`auth.user`, `name`, `sidebarOpen`). Add new global props there — not ad hoc in every controller.

### Dependency injection

Constructor injection only. Do not `new` Services / Repositories / Actions inside controllers.

### Other defaults

- Multi-table writes → `DB::transaction()`
- Heavy work → queues (when introduced)
- Config via `config()`, never `env()` outside config files
- Logging via `Log::*` — never leave `dd()` / `dump()` in committed code

---

## Frontend

### Layout

```text
resources/js/
├── components/        # App components
│   └── ui/            # shadcn/ui primitives — extend these
├── hooks/
├── layouts/
├── lib/               # utils + domain helpers (not utils/)
├── pages/             # Inertia pages (default export)
├── types/
└── app.tsx
```

### Always

- Functional components + TypeScript — no `any` unless unavoidable
- Path alias `@/`
- Keep pages thin; extract UI into components and helpers into `lib/` / hooks
- Extend **shadcn** under `components/ui/` — do not invent a parallel primitive set
- Pages use **default export** (Inertia). Shared components prefer named exports

### Inertia + Wayfinder

- Prefer Wayfinder helpers (`@/routes/...`, `.form()`) over hardcoded URLs
- Prefer Inertia `<Form>` + Wayfinder for standard forms
- Use `router.visit` / `router.get` / `router.post` / etc. for imperative navigation
- Use partial reloads, deferred/lazy props, or polling **only when the page needs them**
- Toasts: rely on flash + `use-flash-toast` / Sonner — do not invent a second notification channel

### Styling

Tailwind CSS only. No inline style objects for layout/skinning unless a library requires it.

### UI feedback

Buttons that trigger any server process must show a loading spinner and be disabled until the process finishes. Keep the loading state clear with `aria-busy` and a temporary action label when useful.

---

## Naming

| Element | Convention | Example |
|---|---|---|
| Controller | PascalCase | `SurveyController` |
| Action | PascalCase + `Action` | `StoreSurveyResponseAction` |
| Service | PascalCase | `DashboardMetricsService` |
| Repository | PascalCase + `Repository` | `SurveyResponseRepository` |
| DTO | PascalCase + `Data` | `SurveyResponseData` |
| Policy | PascalCase + `Policy` | `SurveyResponsePolicy` |
| FormRequest | PascalCase + `Request` | `StoreSurveyResponseRequest` |
| Resource | PascalCase + `Resource` | `SurveyResponseResource` |

---

## Testing & tooling

Every feature should include:

- **Feature tests** — HTTP / Inertia behavior (Pest)
- **Unit tests** — Actions, Services, Policies when logic is non-trivial

Commands:

```bash
composer test          # config:clear + Pint check + PHPStan + Pest
composer lint          # Pint
composer types:check   # PHPStan
npm run lint           # ESLint
npm run types:check    # tsc --noEmit
npm run format         # Prettier
```

Clear config cache before debugging flaky HTTP tests (`419` often means stale `config:cache` in local).

---

## Security (project-specific)

- Validate with FormRequest
- **Policies are mandatory** for domain resources — never rely on `auth` alone
- CSRF is framework-handled; do not disable it
- Never trust frontend-only checks
- Mass assignment via `fillable` / `guarded` (or model attributes) correctly

---

## AI Agent Checklist

Before finishing work:

- [ ] Layered write path (Controller → Action → Repository); reads may use Service/Repository
- [ ] No Eloquent in controllers
- [ ] FormRequest for app input (Fortify Actions excepted)
- [ ] **Policy + `$this->authorize()`** for every protected domain route
- [ ] DTO between Request and Action/Service
- [ ] Enums for fixed domain values; factories/migrations for schema/data
- [ ] Wayfinder + Inertia patterns; shadcn for UI primitives
- [ ] Pest coverage for the feature; Pint/PHPStan clean when touching PHP

Goal: production-grade Laravel 13 + Inertia.js v3 code that matches **this** repository’s conventions.

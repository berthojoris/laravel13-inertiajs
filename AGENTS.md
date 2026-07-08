# AGENTS.md — AI Development Guidelines

## Laravel 13 + Inertia.js v3

This repository is maintained by both humans and AI coding agents. Every rule below is mandatory. When multiple approaches are possible, always choose the one that is easier to maintain, scalable, testable, readable, follows Laravel conventions, follows SOLID principles, and production-ready.

> Never optimize for fewer lines of code. Always optimize for maintainability.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Laravel 13, PHP 8.4+ |
| Frontend | React 19, Inertia.js v3, TypeScript, Vite, Tailwind CSS v4 |
| Database | SQLite |
| Authentication | Laravel Starter Kit / Laravel Auth, Policies, Gates |
| Queue / Cache | Laravel Queue, Redis |
| Filesystem | Laravel Filesystem |

---

## Architecture — Layered

This project follows **Layered Architecture**. Business logic must never be placed inside Controllers, Models, Middleware, Routes, Console Commands, Jobs, Events, or Listeners. Business logic belongs only inside **Service / Action** classes.

### Data Flow

```
Controller  →  Action  →  Service  →  Repository  →  Model
```

### Directory Structure

```text
app/
├── Actions/
├── Services/
├── Repositories/
├── DTO/               # Data Transfer Objects
├── Data/
├── Queries/
├── Policies/
├── Enums/
├── Exceptions/
├── Http/
│   ├── Controllers/
│   ├── Requests/      # FormRequest classes
│   └── Resources/     # API Resources
├── Models/
├── Events/
├── Jobs/
├── Listeners/
├── Observers/
├── Providers/
├── Support/
└── Traits/
```

---

## Backend

### Controllers

Controllers **must only**: authorize, validate (via FormRequest), call an Action or Service, return a response.

Controllers **must never**: query the database, contain business logic, manipulate collections extensively, or exceed ~30 lines.

```php
// Bad — business logic in controller
public function store(Request $request): RedirectResponse {
    $data = $request->validate([...]);
    $item = Item::create($data);
    Mail::to($item->user)->send(new ItemCreated($item));
    return redirect('/items');
}

// Good — thin controller, delegates to Action
public function store(
    StoreItemRequest $request,
    CreateItemAction $action,
): RedirectResponse {
    $action->execute(ItemData::fromRequest($request));
    return redirect('/items');
}
```

### Actions

One use case per Action. One public method: `execute(...)`. No static methods.

```php
class CreateUserAction
{
    public function __construct(
        private readonly UserRepository $repository,
    ) {}

    public function execute(UserData $data): User { /* ... */ }
}
```

### Services

Reusable business logic. May call repositories.

```php
class InvoiceCalculatorService { /* ... */ }
class PriceService { /* ... */ }
```

### Repositories

All Eloquent / Query Builder access lives here. Controllers must never use Eloquent directly.

```php
class UserRepository
{
    public function __construct(private readonly User $model) {}

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }
}
```

### Models

Represent persistence only.

**Allowed**: relationships, scopes, casts, accessors, mutators, observers.

**Not allowed**: business logic, complex calculations, API integrations.

### Validation

Always use `FormRequest`. Never validate inside a controller.

```php
// Good
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return ['email' => ['required', 'email', Rule::unique('users')]];
    }
}
```

### Authorization

Always use Policies or Gates. Never manually check permissions inside a controller.

### DTO

Use DTO objects when passing structured data. Never pass raw request objects into Services.

```php
// Good
$action->execute(UserData::fromRequest($request));

// Bad
$action->execute($request);
```

### Database

Always use Migration, Seeder, Factory. Never manually modify the schema. Never use raw SQL unless absolutely necessary. Prefer Eloquent or Query Builder via Repository.

### Eloquent

Always eager load. Avoid N+1. Use `with()`, `load()`, `loadMissing()`, and scopes.

```php
// Good
User::with('orders')->where('active', true)->first();
```

### Transactions

When updating multiple tables, always use `DB::transaction()`.

### API Integrations

All external API logic belongs in `Services/Integrations`. Never call HTTP directly inside controllers.

```php
Http::retry(3, 100)->timeout(10)->post('https://api.example.com/orders', $data);
```

Always handle timeouts, retries, and exceptions.

### Exceptions

Create custom exceptions. Never throw generic `Exception`.

```php
throw new InsufficientBalanceException('Balance too low');
```

### Enums

Use PHP Enums. Never use magic strings.

```php
// Good
$status = OrderStatus::Paid;

// Bad
$status = 'paid';
```

### Events

Fire events only after successful business operations.

```php
UserRegistered::dispatch($user);
OrderPaid::dispatch($order);
```

### Jobs

Heavy tasks must always use queues. Examples: email, import, export, PDF, video processing, notifications. Never perform long-running tasks synchronously.

### Caching

```php
Cache::remember('key', now()->addMinutes(10), fn () => ExpensiveQuery::run());
```

Always define TTL.

### Logging

Use `Log::info()`, `Log::warning()`, `Log::error()`. **Never** use `dd()`, `dump()`, `var_dump()`, or `print_r()` in production code.

### Configuration

Never hardcode URLs, API keys, secrets, or timeouts. Use config files. Never access `env()` outside config files — always use `config()`.

### Dependency Injection

Always use constructor injection. **Never** instantiate services manually.

```php
// Bad
$service = new PaymentService();

// Good
public function __construct(
    private readonly PaymentService $service,
) {}
```

---

## Frontend

### Technology

React 19, Inertia.js v3, TypeScript, functional components, custom hooks, Vite, Tailwind CSS v4.

### Directory Structure

```text
resources/js/
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts
├── lib/          # Utilities and constants
├── pages/        # Inertia page components
├── types/        # Shared TypeScript types and interfaces
├── utils/        # Helper functions
└── app.tsx
```

### Always

- Use functional components only.
- Type every component, hook, and utility. Never use `any`.
- Prefer composition through custom hooks.
- Keep components small and focused on a single responsibility.
- Reuse shared components.
- Use named exports unless a framework convention requires a default export.
- Keep page components thin — move business logic into Actions and Services.
- Use path aliases (`@/`), not long relative imports.
- Use custom hooks for: Authentication, Permissions, Data fetching, Pagination, Debouncing, Dialogs, Toast notifications.

### Never

- Use class components.
- Put business logic inside React components.
- Call APIs directly inside reusable UI components.
- Duplicate UI or business logic.
- Create components larger than ~300 lines without justification.
- Use `any` unless absolutely unavoidable.

### React Best Practices

- Prefer derived state over duplicated state.
- Use Context only for truly global state. Prefer prop composition.
- Memoize only when profiling shows measurable benefit.
- Prefer controlled components for forms.
- Split components when they exceed ~200–300 lines or have multiple responsibilities.
- Always type component props using TypeScript interfaces or type aliases.

### Inertia

- Use `router.visit()`, `router.post()`, `router.put()`, `router.patch()`, `router.delete()`.
- Use `useForm()` for forms.
- Use partial reloads, deferred props, lazy props, remember state. Use polling only when necessary.

### Styling

Tailwind CSS only. No inline styles. Extract repeated classes into shared components.

### API Resources

Always use Laravel API Resources. Never return raw models from an API.

### File Upload

Always validate `type`, `size`, `mime`. Use Storage facade. Never use `public_path()` for uploads.

### Pagination

Always use Laravel paginator. Never manually paginate collections.

### Query Optimization

Prefer `exists()` over `count()` when checking existence. Use `chunk()`, `lazy()`, or `cursor()` for large datasets.

---

## Code Quality

### Naming

| Element | Convention | Example |
|---|---|---|
| Controller | PascalCase | `UserController` |
| Action | PascalCase + Action suffix | `CreateUserAction` |
| Service | PascalCase | `UserService` |
| Repository | PascalCase + Repository suffix | `UserRepository` |
| DTO | PascalCase + Data suffix | `UserData` |
| Policy | PascalCase + Policy suffix | `UserPolicy` |
| FormRequest | PascalCase + Request suffix | `StoreUserRequest` |
| Resource | PascalCase + Resource suffix | `UserResource` |

### SOLID

Every code must respect: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

### DRY

Never duplicate business logic. Extract reusable code.

### KISS

Choose the simplest maintainable solution. Avoid unnecessary abstractions.

### YAGNI

Do not build features that are not requested.

### Code Style

Follow Laravel Pint and PSR-12. Keep methods short. Prefer early return. Avoid nested if statements.

### Comments

Write self-documenting code. Only comment **why**, never **what**.

---

## Testing

Every new feature must include:

- **Feature Tests** — end-to-end behavior
- **Unit Tests** — for Services and Actions
- **Repository Tests** — when needed

Prefer Pest.

---

## Security

- Always validate input.
- Escape output.
- Use CSRF.
- Use Policies.
- Never trust frontend input.
- Prevent mass assignment — use `fillable` or `guarded` correctly.

---

## Performance

- Always eager load (`with()`).
- Avoid duplicate queries.
- Cache expensive operations. Always define TTL.
- Queue heavy work.
- Optimize pagination.

---

## AI Agent Checklist

When generating code, ensure:

- [ ] Follow Layered Architecture
- [ ] Never place business logic inside controllers
- [ ] Never bypass FormRequest
- [ ] Never bypass Policies
- [ ] Never duplicate code
- [ ] Always use DTO
- [ ] Always use Repository
- [ ] Always use Service / Action
- [ ] Always use dependency injection
- [ ] Prefer readability over clever code
- [ ] Follow Laravel, Inertia, React, and TypeScript best practices
- [ ] Think like a senior architect

The goal is production-grade code that is scalable, testable, maintainable, and follows modern Laravel 13 + Inertia.js v3 best practices.

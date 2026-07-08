# AGENTS.md

# AI Development Guidelines
## Laravel 13 + Inertia.js v3

This repository is designed to be maintained by both humans and AI coding agents.

All AI agents MUST follow every rule in this document.

If multiple approaches are possible, always choose the one that is:

- easier to maintain
- scalable
- testable
- readable
- follows Laravel conventions
- follows SOLID principles
- production-ready

Never optimize for fewer lines of code.
Always optimize for maintainability.

---

# Tech Stack

Framework

- Laravel 13
- PHP 8.4+

Frontend

- Inertia.js v3
- React 19
- TypeScript
- Vite
- TailwindCSS

Database

- SQLite

Authentication

- Laravel Starter Kit / Laravel Auth
- Policies
- Gates

Queue

- Laravel Queue
- Redis

Cache

- Redis

Filesystem

- Laravel Filesystem

---

# Architecture

This project MUST follow Layered Architecture.

Never place business logic inside:

- Controllers
- Models
- Middleware
- Routes
- Console Commands
- Jobs
- Events
- Listeners

Business logic belongs only inside Service / Action classes.

Recommended structure:

app/

    Actions/
    Services/
    Repositories/
    DTO/
    Data/
    Queries/
    Policies/
    Enums/
    Exceptions/
    Http/
        Controllers/
        Requests/
        Resources/
    Models/
    Events/
    Jobs/
    Listeners/
    Observers/
    Providers/
    Support/
    Traits/

---

# Layer Responsibilities

## Controllers

Controllers should ONLY:

- authorize
- validate
- call Action/Service
- return response

Controllers should never:

- query database
- contain business logic
- manipulate collections extensively
- contain more than ~30 lines

Good

Controller

↓

Action

↓

Service

↓

Repository

↓

Model

---

## Actions

Actions represent one use case.

Examples:

CreateUserAction

UpdateOrderAction

DeleteInvoiceAction

PublishPostAction

GenerateReportAction

Each Action should have ONE public method.

```
execute(...)
```

No static methods.

---

## Services

Services contain reusable business logic.

Example:

```
InvoiceCalculatorService

PriceService

PermissionService

NotificationService
```

Services may call repositories.

---

## Repositories

Repositories are responsible for database access.

Repositories should contain:

- Eloquent queries
- Query Builder
- pagination
- eager loading

Controllers must never use Eloquent directly.

---

## Models

Models represent persistence only.

Allowed:

Relationships

Scopes

Casts

Accessors

Mutators

Observers

Not allowed:

Business logic

Complex calculations

API integrations

---

# Validation

Always use FormRequest.

Never validate inside controller.

Example

```
StoreUserRequest
UpdateUserRequest
```

---

# Authorization

Always use

Policies

or

Gates

Never manually check permissions inside controller.

---

# DTO

Use DTO objects whenever passing structured data.

Never pass raw request objects into Services.

Good

```
UserData

OrderData

ProductData
```

---

# Database

Always use:

Migration

Seeder

Factory

Never manually modify database schema.

Never use raw SQL unless absolutely necessary.

Prefer:

Eloquent

Query Builder

Repository

---

# Eloquent

Always eager load.

Avoid N+1.

Use:

```
with()

load()

loadMissing()
```

Use scopes.

Example

```
User::active()
```

Avoid duplicated queries.

---

# Transactions

Whenever updating multiple tables:

Always use

```
DB::transaction()
```

---

# API Integrations

All external API logic belongs inside

```
Services/Integrations
```

Never call HTTP directly inside controllers.

Use

Laravel HTTP Client

```
Http::retry()
    ->timeout()
```

Always handle:

timeouts

retries

exceptions

---

# Exceptions

Create custom exceptions.

Never throw generic Exception.

Example

```
InsufficientBalanceException

PaymentFailedException

InvalidCouponException
```

---

# Enums

Use PHP Enums whenever applicable.

Never use magic strings.

Example

```
OrderStatus

UserRole

PaymentStatus
```

---

# Events

Fire events only after successful business operations.

Example

```
UserRegistered

OrderPaid

InvoiceGenerated
```

---

# Jobs

Heavy tasks should always use queues.

Examples

Email

Import

Export

PDF

Video processing

Image processing

Notifications

Never perform long-running tasks synchronously.

---

# Notifications

Use Laravel Notifications.

Never duplicate notification logic.

---

# Caching

Cache expensive queries.

Use:

```
Cache::remember()

Cache::tags()
```

Always define TTL.

---

# Logging

Use

```
Log::info()

Log::warning()

Log::error()
```

Never use

```
dd()

dump()

var_dump()

print_r()
```

Production code must not contain debugging statements.

---

# Configuration

Never hardcode:

URLs

API Keys

Secrets

Timeouts

Use config files.

---

# Environment

Never access:

```
env()
```

outside config files.

Always use

```
config()
```

---

# Dependency Injection

Always use constructor injection.

Never instantiate services manually.

Bad

```
new PaymentService()
```

Good

```
public function __construct(
    PaymentService $service
)
```

---

# Frontend

Use:

- React 19
- Inertia.js v3
- TypeScript
- Functional Components
- React Hooks
- Vite
- Tailwind CSS v4

Always:

- Use functional components only.
- Use TypeScript for every component, hook, and utility.
- Prefer composition through custom hooks.
- Keep components small and focused on a single responsibility.
- Reuse shared components whenever possible.
- Use named exports unless a framework convention requires a default export.
- Keep page components thin by moving business logic into Actions and Services.
- Use path aliases instead of long relative imports when configured.

Never:

- Use class components.
- Use `any` unless absolutely unavoidable.
- Put business logic inside React components.
- Put API calls directly inside page components when they belong in reusable hooks or services.
- Duplicate UI or business logic.
- Create overly large components (>300 lines) without a clear justification.

Organize frontend code as follows:

```
resources/
└── js/
    ├── components/
    ├── hooks/
    ├── layouts/
    ├── lib/
    ├── pages/
    ├── types/
    ├── utils/
    └── app.tsx
```

Prefer:

- Custom Hooks
- Composition
- Reusable Components
- Strong TypeScript typing
- Clear separation between UI, state, and business logic

# Inertia

Pages belong inside

```
resources/js/pages
```

Reusable components belong inside

```
resources/js/components
```

Layouts

```
resources/js/layouts
```

Composables

```
resources/js/composables
```

Utilities

```
resources/js/lib
```

Types

```
resources/js/types
```

---

# Inertia Best Practices

Use

```
router.visit()

router.post()

router.put()

router.patch()

router.delete()
```

Use

```
useForm()
```

for forms.

Use partial reloads.

Use deferred props.

Use lazy props.

Use remember state.

Use polling only when necessary.

---

# React

Prefer custom hooks for reusable logic.

Never duplicate business logic or UI logic.

Split components when they exceed approximately 200–300 lines or have multiple responsibilities.

Keep components focused on a single responsibility.

Move complex logic into custom hooks.

Move business logic into Actions and Services, never React components.

Prefer composition over inheritance.

Avoid deeply nested component trees.

Memoize components and callbacks only when profiling shows a measurable performance benefit.

Avoid premature optimization.

Keep page components thin by extracting reusable UI into shared components.

Prefer controlled components for forms unless there is a clear performance reason otherwise.

Always type component props using TypeScript interfaces or type aliases.

Avoid using `any`.

Keep local state minimal.

Prefer derived state over duplicated state.

Use Context only for truly global state. Do not replace prop composition with Context unnecessarily.

Use custom hooks for:
- Authentication
- Permissions
- Data fetching
- Pagination
- Debouncing
- Dialogs
- Toast notifications
- Shared UI behavior

Never perform API requests directly inside reusable UI components unless they are specifically designed as data-fetching components.

---

# TypeScript

Never use

```
any
```

Always define interfaces.

Prefer

type

or

interface

---

# Components

Small

Reusable

Composable

Single responsibility

Avoid giant page components.

---

# Styling

TailwindCSS only.

Avoid inline styles.

Extract repeated classes into components.

---

# File Upload

Always validate

type

size

mime

Use Storage facade.

Never use public_path() for uploads.

---

# API Resources

Always use Laravel API Resources.

Never return raw models from API.

---

# Pagination

Always use Laravel paginator.

Never manually paginate collections.

---

# Query Optimization

Prefer

exists()

instead of

count()

when checking existence.

Use chunk()

lazy()

cursor()

for large datasets.

---

# Naming

Controllers

```
UserController
```

Actions

```
CreateUserAction
```

Services

```
UserService
```

Repositories

```
UserRepository
```

DTO

```
UserData
```

Policies

```
UserPolicy
```

Requests

```
StoreUserRequest
```

Resources

```
UserResource
```

---

# SOLID

Every new code should respect:

Single Responsibility

Open/Closed

Liskov

Interface Segregation

Dependency Inversion

---

# DRY

Never duplicate business logic.

Extract reusable code.

---

# KISS

Choose the simplest maintainable solution.

Avoid unnecessary abstractions.

---

# YAGNI

Do not build features that are not requested.

---

# Code Style

Follow Laravel Pint.

Follow PSR-12.

Keep methods short.

Prefer early return.

Avoid nested if statements.

---

# Comments

Write self-documenting code.

Only comment WHY.

Never comment WHAT.

---

# Testing

Every new feature should include:

Feature Tests

Unit Tests (for Services/Actions)

Repository Tests (when needed)

Prefer Pest.

---

# Security

Always validate input.

Escape output.

Use CSRF.

Use Policies.

Never trust frontend input.

Prevent mass assignment.

Use fillable or guarded correctly.

---

# Performance

Always eager load.

Avoid duplicate queries.

Cache expensive operations.

Queue heavy work.

Optimize pagination.

---

# AI Agent Rules

When generating code:

✔ Follow Layered Architecture.

✔ Never place business logic inside controllers.

✔ Never bypass FormRequest.

✔ Never bypass Policies.

✔ Never duplicate code.

✔ Always use DTO.

✔ Always use Repository.

✔ Always use Service/Action.

✔ Always use dependency injection.

✔ Always write maintainable code.

✔ Prefer readability over clever code.

✔ Follow Laravel best practices.

✔ Follow Inertia best practices.

✔ Follow React best practices.

✔ Follow TypeScript best practices.

✔ Think like a senior Laravel architect.

The goal is to produce production-grade code that is scalable, testable, maintainable, and follows modern Laravel 13 + Inertia.js v3 best practices.
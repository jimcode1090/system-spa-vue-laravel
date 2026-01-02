# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application with Vite for asset bundling and Tailwind CSS 4 for styling. The project uses Pest for testing (a wrapper around PHPUnit with a more expressive API).

## Development Commands

### Setup
```bash
composer setup
```
This runs the full setup: installs dependencies, creates .env, generates app key, runs migrations, and builds frontend assets.

### Development Server
```bash
composer dev
```
Runs three concurrent processes:
- Laravel development server (`php artisan serve`)
- Queue worker (`php artisan queue:listen --tries=1`)
- Vite dev server with HMR (`npm run dev`)

Alternatively, run individually:
```bash
php artisan serve        # Start Laravel server
npm run dev              # Start Vite dev server
php artisan queue:listen # Start queue worker
```

### Frontend Assets
```bash
npm run dev    # Development mode with hot reload
npm run build  # Production build
```

### Testing
```bash
composer test                           # Run all tests
php artisan test                        # Alternative way to run tests
php artisan test --filter TestName      # Run specific test
php artisan test tests/Feature/ExampleTest.php  # Run specific test file
```

Tests use Pest framework with two suites:
- `tests/Feature/` - Feature/integration tests
- `tests/Unit/` - Unit tests

Test environment uses SQLite in-memory database (configured in phpunit.xml).

### Code Quality
```bash
vendor/bin/pint          # Laravel Pint - code formatting (PSR-12)
vendor/bin/pint --test   # Check formatting without fixing
```

### Database
```bash
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Drop all tables and re-run migrations
php artisan migrate:fresh --seed # Fresh migration + seed data
php artisan db:seed              # Run database seeders
```

### Artisan Commands
```bash
php artisan route:list    # List all registered routes
php artisan tinker        # Interactive REPL for Laravel
php artisan config:clear  # Clear configuration cache
php artisan cache:clear   # Clear application cache
php artisan view:clear    # Clear compiled views
```

## Architecture

### Backend Structure (Laravel 12)

- **`app/Http/Controllers/`** - HTTP controllers
- **`app/Models/`** - Eloquent models
- **`app/Providers/`** - Service providers
- **`routes/web.php`** - Web routes (uses closure-based routing by default)
- **`routes/console.php`** - Artisan console commands
- **`database/migrations/`** - Database schema migrations
- **`database/factories/`** - Model factories for testing/seeding
- **`database/seeders/`** - Database seeders

Laravel 12 uses a streamlined bootstrap configuration in `bootstrap/app.php` with the Application builder pattern for routing, middleware, and exception handling.

### Frontend Structure

- **`resources/js/app.js`** - Main JavaScript entry point (imports bootstrap.js, initializes Vue 3, jQuery, and Bootstrap)
- **`resources/js/plantilla.js`** - AdminLTE template bundle entry point (imports AdminLTE JS files)
- **`resources/js/bootstrap.js`** - Bootstraps Axios with CSRF token handling
- **`resources/js/src/components/`** - Vue 3 single-file components (.vue files)
- **`resources/js/src/composables/`** - Reusable Vue 3 composables (utilities, business logic)
- **`resources/js/src/views/`** - Vue page-level components (route views)
- **`resources/js/src/router/`** - Vue Router configuration
- **`resources/css/app.css`** - Main CSS file for custom styles
- **`resources/css/plantilla.css`** - AdminLTE template bundle entry point (imports AdminLTE CSS and FontAwesome)
- **`resources/vendor/`** - Third-party vendor files (AdminLTE, FontAwesome)
- **`resources/views/`** - Blade templates (server-side templating)
- **`public/`** - Public assets (Vite compiles to `public/build/`)

Frontend stack:
- **Vue 3** - Progressive JavaScript framework (Composition API and Options API supported)
- **Vite** for bundling and HMR with Vue SFC support
- **AdminLTE 3** - Admin dashboard template (includes Bootstrap 4)
- **Bootstrap 4.4.1** - UI framework (included via AdminLTE, also available in plantilla.js)
- **jQuery** - Available globally in plantilla bundle
- **FontAwesome** for icons (via AdminLTE bundle)
- **Axios** pre-configured globally with CSRF headers

### Vite Configuration

The `vite.config.js` is configured to:
- Compile multiple entry points:
  - `resources/css/app.css` and `resources/js/app.js` (main app with Vue 3)
  - `resources/css/plantilla.css` and `resources/js/plantilla.js` (AdminLTE template bundle)
- Enable browser refresh on file changes
- Support Vue 3 single-file components (.vue files) via `@vitejs/plugin-vue`
- Use Vue's ESM bundler build for full template compilation support
- Ignore compiled Blade views in `storage/framework/views/` to prevent infinite reload loops

### AdminLTE Template

AdminLTE files are bundled through the plantilla entry points:

**Using in Blade templates:**
```blade
@vite(['resources/css/plantilla.css', 'resources/js/plantilla.js'])
```

The plantilla bundle includes:
- **CSS**: FontAwesome icons + AdminLTE styles
- **JS**: AdminLTE core functionality + demo customization panel

Source files in `resources/vendor/`:
- `css/all.min.css` - FontAwesome icons
- `css/adminlte.min.css` - AdminLTE styles
- `js/adminlte.min.js` - AdminLTE JavaScript
- `js/demo.js` - AdminLTE customization panel (optional, can be removed in production)

### Vue 3 Setup

Vue components are registered in `resources/js/app.js`:
- Components must be imported and registered using `app.component(name, component)`
- Example component available at `resources/js/components/ExampleComponent.vue`
- The Vue app mounts to an element with `id="app"` in your Blade templates
- Both Options API and Composition API are supported

### Vue 3 Composables

Composables are reusable functions that encapsulate stateful logic using the Composition API. They are located in `resources/js/src/composables/`.

**Available Composables:**

#### usePagination
Location: `resources/js/src/composables/utilities/usePagination.js`

Provides complete pagination functionality for lists. This composable handles all pagination logic including page navigation, item slicing, and state management.

**Usage:**
```javascript
import { usePagination } from '@/composables/utilities/usePagination'

const items = ref([...]) // Your data array

const {
    paginatedItems,      // Computed: Items for current page
    currentPage,         // Ref: Current page index (0-based)
    totalPages,          // Computed: Total number of pages
    pageNumbers,         // Computed: Array of page indices
    hasPreviousPage,     // Computed: Boolean - can go back
    hasNextPage,         // Computed: Boolean - can go forward
    goToNextPage,        // Method: Navigate to next page
    goToPreviousPage,    // Method: Navigate to previous page
    goToPage,            // Method: Navigate to specific page
    resetPagination,     // Method: Reset to first page
    isPageActive         // Method: Check if page is active
} = usePagination(items, 5) // 5 items per page
```

**Best Practices:**
- Always call `resetPagination()` when fetching new data or clearing filters
- Use `hasPreviousPage` and `hasNextPage` to conditionally render navigation buttons
- Use `isPageActive(page)` to highlight the current page in UI
- The composable works with reactive refs, so changes to the source array automatically update pagination

**Example Implementation:**
See `resources/js/src/views/users/UserListView.vue` for a complete working example.

#### useAsync
Location: `resources/js/src/composables/utilities/useAsync.js`

Handles asynchronous operations with loading states and error handling.

### Testing with Pest

Tests are configured in `tests/Pest.php`:
- Feature tests extend `Tests\TestCase` (includes Laravel application bootstrap)
- Database refreshing is commented out by default - uncomment `RefreshDatabase` trait if needed
- Custom expectations and helper functions can be added in Pest.php

## Key Conventions

- This project uses **Pest** syntax for tests, not PHPUnit directly (e.g., `it()` and `test()` functions)
- Vue 3 components use `.vue` extension and should be placed in `resources/js/components/`
- Vue components must be registered in `app.js` before they can be used in templates
- Blade views use `.blade.php` extension
- Bootstrap 5 and jQuery are available globally in all JavaScript files
- Queue jobs should be run with the queue worker when developing queue-based features
- The health check endpoint is available at `/up` (configured in bootstrap/app.php)
- To use Vue components in Blade templates, add `<div id="app">` wrapper and include components with `<example-component></example-component>`

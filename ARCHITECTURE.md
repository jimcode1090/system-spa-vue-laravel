# Architecture Documentation

## Backend Architecture (Laravel)

### Layer Pattern Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                         REQUEST                              │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   FormRequest Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ListUsersRequest                                    │   │
│  │  - Validation Rules (Backend)                        │   │
│  │  - Authorization Logic                               │   │
│  │  - Custom Error Messages                             │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ (validated data)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UserController                                      │   │
│  │  - Receives validated request                        │   │
│  │  - Delegates to Service Layer                        │   │
│  │  - Returns JSON response                             │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UserService                                         │   │
│  │  - Business Logic                                    │   │
│  │  - Data Transformation                               │   │
│  │  - Logging, Caching, etc.                            │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UserRepository (implements UserRepositoryInterface) │   │
│  │  - Database Operations                               │   │
│  │  - Stored Procedures                                 │   │
│  │  - Query Building                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   DATABASE   │
                     └──────────────┘
```

## Frontend Architecture (Vue 3)

### MVVM Pattern Implementation

```
┌─────────────────────────────────────────────────────────────┐
│                          VIEW                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ListUserView.vue / CreateUserView.vue               │   │
│  │  - Template (UI Only)                                │   │
│  │  - Binds to ViewModel                                │   │
│  │  - No Business Logic                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ (bindings)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       VIEW MODEL                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  useListUserViewModel / useCreateUserViewModel       │   │
│  │  - Form State Management                             │   │
│  │  - Validation (VeeValidate + Yup)                    │   │
│  │  - Event Handlers                                    │   │
│  │  - Backend Error Handling                            │   │
│  │  - Uses Composables (useAsync, usePagination)        │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION SCHEMA                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  useUserValidationSchema / useUserFilterSchema       │   │
│  │  - Yup validation rules (Frontend)                   │   │
│  │  - Field constraints                                 │   │
│  │  - Error messages                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  userService.js                                      │   │
│  │  - API Communication (Axios)                         │   │
│  │  - Data Mapping (User.fromApi)                       │   │
│  │  - Error Propagation                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────────┐
                  │  BACKEND API (Laravel) │
                  └──────────────────────┘
```

## Utility Composables

### useAsync
```javascript
// Handles async operations with loading states
const { loading, error, execute } = useAsync()
```
**Benefits:**
- Centralized loading state management
- Automatic error handling
- Reusable across ViewModels

### usePagination
```javascript
// Handles pagination logic
const {
    paginatedItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage
} = usePagination(items, itemsPerPage)
```

### useBackendValidation
```javascript
// Maps Laravel validation errors to VeeValidate
const { mapBackendErrors, isValidationError } = useBackendValidation()
```

## Validation Strategy

### Dual Validation (Frontend + Backend)

#### Frontend Validation (VeeValidate + Yup)
- **Purpose**: Immediate user feedback
- **Benefits**: Better UX, reduces server load
- **Location**: `useUserValidationSchema.js`, `useUserFilterSchema.js`

#### Backend Validation (FormRequest)
- **Purpose**: Security, data integrity
- **Benefits**: Server-side protection, prevents malicious requests
- **Location**: `ListUsersRequest.php`

### Error Flow
```
1. User submits form
2. Frontend validates (VeeValidate)
   └─ If invalid → Show errors immediately
   └─ If valid → Send to backend
3. Backend validates (FormRequest)
   └─ If invalid (422) → Return errors
   └─ If valid → Process request
4. Frontend catches 422 errors
5. Maps backend errors to VeeValidate format
6. Displays backend errors in form
```

## Key Benefits of This Architecture

### Backend
✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Testability** - Easy to unit test each layer independently
✅ **Maintainability** - Changes in one layer don't affect others
✅ **Scalability** - Easy to add new features
✅ **SOLID Principles** - Follows Dependency Inversion Principle

### Frontend
✅ **MVVM Pattern** - View is decoupled from business logic
✅ **Reusability** - Composables can be shared across components
✅ **Type Safety** - Yup schemas provide runtime type checking
✅ **DRY Principle** - No code duplication
✅ **Better UX** - Loading states, real-time validation

## Dependency Injection

### Service Provider Registration
```php
// RepositoryServiceProvider.php
$this->app->bind(UserRepositoryInterface::class, UserRepository::class);
```

### Controller Injection
```php
public function __construct(UserService $userService)
{
    $this->userService = $userService;
}
```

**Benefits:**
- Loose coupling
- Easy to swap implementations
- Testable with mocks

## Example Request Flow

### User List with Filters

1. **User fills filter form** → ListUserView.vue
2. **Form validates** → useUserFilterSchema.js (Yup)
3. **ViewModel processes** → useListUserViewModel.js
4. **Service makes API call** → userService.js
5. **Backend validates** → ListUsersRequest.php
6. **Controller delegates** → UserController.php
7. **Service processes** → UserService.php
8. **Repository queries DB** → UserRepository.php
9. **Response flows back** through all layers
10. **ViewModel updates state** → View re-renders

## File Structure

```
Backend:
├── app/
│   ├── Http/
│   │   ├── Controllers/Admin/
│   │   │   └── UserController.php
│   │   └── Requests/Admin/User/
│   │       └── ListUsersRequest.php
│   ├── Services/
│   │   └── UserService.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   └── UserRepositoryInterface.php
│   │   └── Eloquent/
│   │       └── UserRepository.php
│   └── Providers/
│       └── RepositoryServiceProvider.php

Frontend:
├── resources/js/src/
│   ├── views/users/
│   │   ├── ListUserView.vue
│   │   └── CreateUserView.vue
│   ├── viewmodels/
│   │   ├── useListUserViewModel.js
│   │   └── useCreateUserViewModel.js
│   ├── composables/
│   │   ├── users/
│   │   │   ├── useUserValidationSchema.js
│   │   │   └── useUserFilterSchema.js
│   │   └── utilities/
│   │       ├── useAsync.js
│   │       ├── usePagination.js
│   │       └── useBackendValidation.js
│   └── services/
│       └── userService.js
```

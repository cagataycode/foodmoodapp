# Types Directory

This directory contains all TypeScript type definitions for the FoodMood backend, organized by feature and functionality.

## 📁 Structure

```
types/
├── index.ts              # Barrel export - exports all types
├── user.types.ts         # User-related types
├── food-log.types.ts     # Food logging types
├── insight.types.ts      # AI insights types
├── auth.types.ts         # Authentication types
├── common.types.ts       # Shared/common types
├── errors.types.ts       # Error classes and types
├── database.types.ts     # Database schema types
└── README.md            # This file
```

## 🏗️ Organization

### **user.types.ts**

- `User` - User profile interface
- `CreateUserRequest` - User creation request
- `UpdateUserRequest` - User update request

### **food-log.types.ts**

- `FoodLog` - Food log entry interface
- `MoodType` - Available mood options
- `CreateFoodLogRequest` - Food log creation request
- `UpdateFoodLogRequest` - Food log update request
- `FoodLogFilters` - Filtering options for food logs

### **insight.types.ts**

- `Insight` - AI insight interface
- `InsightFilters` - Filtering options for insights

### **auth.types.ts**

- `AuthRequest` - Authentication request
- `AuthResponse` - Authentication response
- `AuthenticatedRequest` - Request with user context

### **common.types.ts**

- `ApiResponse<T>` - Standard API response format
- `PaginationParams` - Pagination parameters
- `EnvironmentVariables` - Environment variable types

### **errors.types.ts**

- `AppError` - Base error class
- `ValidationError` - Validation error
- `AuthenticationError` - Authentication error
- `AuthorizationError` - Authorization error
- `NotFoundError` - Not found error

### **database.types.ts**

- `Database` - Supabase database schema types

## 🔧 Usage

### Import from barrel export (recommended)

```typescript
import { User, FoodLog, ApiResponse } from '../types';
```

### Import from specific files (for specific use cases)

```typescript
import { User, CreateUserRequest } from '../types/user.types';
import { FoodLog, MoodType } from '../types/food-log.types';
```

## 📝 Adding New Types

1. **Choose the appropriate file** based on the type's purpose
2. **Add the type definition** with proper JSDoc comments
3. **Export the type** from the file
4. **The barrel export** in `index.ts` will automatically include it

### Example: Adding a new user type

```typescript
// user.types.ts
export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}
```

## 🎯 Best Practices

1. **Group related types** in the same file
2. **Use descriptive names** for types and interfaces
3. **Add JSDoc comments** for complex types
4. **Keep types focused** - one responsibility per file
5. **Use barrel exports** for clean imports
6. **Extend existing types** when possible instead of duplicating

## 🔄 Migration from Single File

The types were previously in a single `index.ts` file. The new structure provides:

- **Better organization** by feature
- **Easier maintenance** and updates
- **Clearer dependencies** between types
- **Better IDE support** with focused files
- **Easier testing** of specific type groups

## 📚 Related Files

- **Controllers**: Use types for request/response validation
- **Services**: Use types for business logic
- **DTOs**: Extend types for API documentation
- **Database**: Types match Supabase schema

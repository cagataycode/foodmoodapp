# FoodMood App Refactoring Workflow

This document demonstrates practical refactoring skills and clean code principles applied during the development and improvement of the FoodMood application. It showcases the ability to recognize code quality issues ("bad smells") and fix them through systematic, incremental changes.

## Learning Objectives Demonstrated

This refactoring workflow demonstrates:

- **Recognition of quality issues** and code smells
- **Incremental improvement** through small, atomic changes
- **YAGNI principle** (You Aren't Gonna Need It) application
- **Clean code principles** throughout the codebase
- **Test-driven refactoring** with comprehensive test coverage
- **Atomic commits** showing clear progression of changes

## Identified Code Smells and Refactoring Solutions

### 1. Authentication Security Smell: Custom JWT Implementation

**Code Smell Identified:**

- Custom JWT handling with potential security vulnerabilities
- Manual token validation and user session management
- Inconsistent authentication patterns across the application

**Refactoring Approach:**

```typescript
// Before: Custom JWT handling
@Injectable()
export class AuthService {
  validateToken(token: string) {
    // Manual JWT verification logic
    // Security risks: custom implementation
  }
}

// After: Supabase Auth integration with request-scoped clients
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>
  ) {}
  // Automatic RLS enforcement with industry-standard auth
}
```

**Clean Code Principles Applied:**

- **Single Responsibility Principle (SRP)**: Auth service now only handles auth logic
- **Good identifier names**: Clear, descriptive method and variable names
- **Error handling**: Proper exception handling with meaningful error messages

### 2. Data Access Smell: Inconsistent Database Queries

**Code Smell Identified:**

- Manual user ID checks in every database query
- Repeated authorization logic across services
- Potential data leakage through missing access controls

**Refactoring Solution:**

```typescript
// Before: Manual authorization checks
async getFoodLogs(userId: string) {
  // Manual user validation
  if (!userId) throw new Error('Unauthorized');
  // Risk of data leakage
  return this.db.query('SELECT * FROM food_logs WHERE user_id = ?', [userId]);
}

// After: RLS enforcement through request-scoped clients
async getFoodLogs(userId: string): Promise<FoodLog[]> {
  const { data: foodLogs, error } = await this.supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId); // RLS ensures user only sees their data

  if (error) throw new BadRequestException('Failed to fetch food logs');
  return foodLogs;
}
```

**YAGNI Principle Applied:**

- Removed complex custom authorization logic
- Leveraged existing Supabase RLS instead of building custom solutions

### 3. Function Design Smell: Large, Multi-Purpose Functions

**Code Smell Identified:**

- Functions handling multiple responsibilities
- Long parameter lists
- Unclear return values

**Refactoring Example:**

```typescript
// Before: Large function with multiple responsibilities
async handleUserRegistration(email: string, password: string, username: string, profile: any) {
  // Validation logic
  // User creation
  // Profile creation
  // Email sending
  // Return multiple values
}

// After: Single-responsibility functions
async register(userData: CreateUserRequest & { password: string }): Promise<AuthResponse> {
  const { email, password, username } = userData;

  await this.validateRegistrationData(userData);
  const authData = await this.createSupabaseUser(email, password);
  const profile = await this.createUserProfile(authData.user.id, { email, username });

  return this.formatAuthResponse(profile, authData.session);
}

private async validateRegistrationData(userData: CreateUserRequest): Promise<void> {
  // Single responsibility: validation only
}

private async createUserProfile(userId: string, profileData: CreateUserRequest): Promise<User> {
  // Single responsibility: profile creation only
}
```

**Clean Code Principles Applied:**

- **Good functions**: Small, focused functions with clear purposes
- **Appropriate arguments**: Strongly typed DTOs instead of multiple parameters
- **Good return values**: Clear, predictable return types

## Clean Code Principles Implementation

### 1. Good Identifier Names

**Examples from the codebase:**

```typescript
// Clear, descriptive names
export interface CreateFoodLogRequest {
  food_name: string;
  meal_type: MealType;
  moods: MoodType[];
  meal_time: string;
  portion_size?: string;
  notes?: string;
  image_base64?: string;
}

// Avoid abbreviations and unclear names
// Bad: createFL(req: CFLReq)
// Good: createFoodLog(request: CreateFoodLogRequest)
```

### 2. Appropriate Use of Data Types

**TypeScript Type Safety:**

```typescript
// Strong typing prevents runtime errors
export type MoodType =
  | "happy"
  | "sad"
  | "energetic"
  | "tired"
  | "anxious"
  | "calm"
  | "focused"
  | "distracted";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

// DTOs ensure data integrity
export class CreateFoodLogDto {
  @IsString()
  @Length(1, 100)
  food_name: string;

  @IsEnum(MealType)
  meal_type: MealType;

  @IsArray()
  @ArrayNotEmpty()
  moods: MoodType[];
}
```

### 3. Error Handling and Exceptions

**Consistent Error Handling Pattern:**

```typescript
// Clear error types with meaningful messages
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Proper exception handling in services
async createFoodLog(userId: string, foodLogData: CreateFoodLogRequest): Promise<FoodLog> {
  try {
    const { data: foodLog, error } = await this.supabase
      .from('food_logs')
      .insert({ user_id: userId, ...foodLogData })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create food log: ${error.message}`);
    }

    return foodLog;
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new InternalServerErrorException('Unexpected error creating food log');
  }
}
```

### 4. Principle of Least Astonishment

**Predictable API Design:**

```typescript
// Consistent naming patterns
GET    /api/food-logs     -> getFoodLogs()
POST   /api/food-logs     -> createFoodLog()
PUT    /api/food-logs/:id -> updateFoodLog()
DELETE /api/food-logs/:id -> deleteFoodLog()

// Consistent response format
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Test-Driven Refactoring Workflow

### 1. Testing Before Refactoring

**Example: Authentication Service Tests (auth.service.spec.ts)**

```typescript
// Actual test from the codebase showing RLS and error handling
describe("AuthService", () => {
  const validUserData = {
    email: "test@example.com",
    password: "password123",
    username: "testuser",
  };

  it("should register successfully", async () => {
    const mockQuery = createMockQuery();
    mockQuery.single.mockResolvedValueOnce({ data: null, error: null });
    mockQuery.single.mockResolvedValueOnce({ data: mockUser, error: null });
    setupMock(jest.fn().mockReturnValue(mockQuery));
    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: {
        user: { id: userId },
        session: { access_token: "at", refresh_token: "rt" },
      },
      error: null,
    });

    const result = await service.register(validUserData);

    expect(result).toEqual({
      user: mockUser,
      access_token: "at",
      refresh_token: "rt",
    });
  });
});
```

### 2. Atomic Commits Demonstrating Incremental Changes

**Actual Commit History from the Project:**

```bash
git log --oneline -10
085cb77 Merge pull request #25 from cagataycode/refactor/insight-stories
24381c9 Refactor TrendMini component to enhance readability by consolidating style definitions
399d5e6 Refactor StackedBar component to enhance readability by simplifying style definitions
87465ca Refactor SingleItemDonut component to simplify conditional rendering of the title
34babd7 Refactor DonutChart component to enhance readability by simplifying conditional rendering
35bf7f8 Refactor StoryCard component to improve structure and readability by extracting chart rendering
107086a Refactor StoriesViewer component to enhance readability and maintainability by extracting logic
8a095a8 Refactor StoriesCarousel component for improved readability by simplifying functional structure
3d9b567 Refactor Chips component to simplify conditional rendering of sublabels
90f7416 Refactor BarRow component for improved readability and performance by simplifying conditional rendering
```

**Demonstrates:**

- **Small, focused changes**: Each commit targets a specific component
- **Clear intent**: Every commit message explains the refactoring goal
- **Incremental improvement**: Systematic enhancement of readability and maintainability
- **Atomic commits**: Each change is self-contained and reversible

## Before/After Refactoring: Component Extraction & Reusability (PR #11)

### Example 1: Button Components Extraction

**Before: Inline Styled TouchableOpacity Components**

```jsx
// Repeated button patterns throughout the app
<TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/auth/signin")}>
  <Text style={styles.primaryButtonText}>Sign In</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/auth/signup")}>
  <Text style={styles.secondaryButtonText}>Sign Up</Text>
</TouchableOpacity>

// Repeated styles across multiple files
const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    // ... more styles
  },
  // ... duplicate button styles in every file
});
```

**After: Reusable Button Components**

```jsx
// Clean, reusable components
<PrimaryButton onPress={() => router.push("/auth/signin")} style={{ marginBottom: 18, width: 260 }}>
  Sign In
</PrimaryButton>

<SecondaryButton onPress={() => router.push("/auth/signup")} style={{ width: 260 }}>
  Sign Up
</SecondaryButton>

// Centralized component with props support
const PrimaryButton = ({ onPress, disabled, loading, children, style, ...props }) => (
  <TouchableOpacity
    style={[styles.button, disabled ? styles.buttonDisabled : null, style]}
    onPress={onPress}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{children}</Text>}
  </TouchableOpacity>
);
```

### Example 2: LogFoodModal Component Decomposition

**Before: Monolithic 165-line Component**

```jsx
const LogFoodModal = ({ visible, onClose, onSave, initialLog }) => {
  // 165 lines of mixed responsibilities:
  // - State management
  // - Image picking logic
  // - Form handling
  // - API calls
  // - UI rendering

  return (
    <Modal>
      {/* Inline form fields */}
      <TextInput
        style={styles.input}
        placeholder="e.g., Grilled chicken salad"
      />
      <TouchableOpacity onPress={handleImageIconPress}>
        <GalleryIcon width={28} height={28} />
      </TouchableOpacity>
      {/* More inline components... */}
    </Modal>
  );
};
```

**After: Modular Component Architecture**

```jsx
const LogFoodModal = ({ visible, onClose, onSave, initialLog }) => {
  const { handleSave, isLoading } = useLogFoodSave({
    /* props */
  });

  return (
    <Modal>
      <FoodInputWithImage
        ref={foodInputRef}
        initialFood={food}
        onChange={setFood}
      />
      <MoodSelector initialMoods={selectedMoods} onChange={setSelectedMoods} />
      <TimeSelector
        initialTime={time}
        onChange={setTime}
        options={TIME_OPTIONS}
      />
      <PortionInput initialPortion={portion} onChange={setPortion} />
      <NotesInput initialNotes={notes} onChange={setNotes} />
      <ModalActionButtons
        onSave={handleSave}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};
```

**Refactoring Achievements:**

- **Component Count**: Created 12 new reusable components
- **Code Reduction**: 165-line modal → 65-line orchestrating component
- **Single Responsibility**: Each component handles one specific concern
- **Reusability**: Button components used across 5+ screens
- **Testability**: Smaller components easier to unit test
- **Maintainability**: Changes to form fields isolated to specific components

**Files Modified:** 15 files with systematic component extraction and consistent patterns applied across the entire frontend.

### 3. Complex Logic Implementation (Not Just CRUD)

**Advanced Food Log Filtering Logic (food-logs.service.ts):**

```typescript
// Complex query building with multiple filters
async getFoodLogs(
  userId: string,
  filters: FoodLogFilters = {},
): Promise<FoodLog[]> {
  let query = this.supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .order('meal_time', { ascending: false });

  // Dynamic filter application based on provided criteria
  if (filters.start_date) query = query.gte('meal_time', filters.start_date);
  if (filters.end_date) query = query.lte('meal_time', filters.end_date);
  if (filters.moods?.length > 0) query = query.in('moods', filters.moods);
  if (filters.food_name)
    query = query.ilike('food_name', `%${filters.food_name}%`);

  // Complex pagination logic
  if (filters.limit) query = query.limit(filters.limit);
  if (filters.offset)
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1,
    );

  const { data: foodLogs, error } = await query;
  if (error) throw new BadRequestException('Failed to fetch food logs');
  return foodLogs || [];
}
```

**Request-Scoped Authentication Guard (supabase-auth.guard.ts):**

```typescript
// Complex authentication logic with token validation
async canActivate(context: ExecutionContext): Promise<boolean> {
  const req = context.switchToHttp().getRequest();
  const authHeader: string | undefined = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing or invalid Authorization header');
  }

  const token = authHeader.substring('Bearer '.length);

  // Create request-scoped Supabase client for RLS enforcement
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    throw new UnauthorizedException('Invalid or expired token');
  }

  // Attach user context for RLS
  req.user = {
    id: data.user.id,
    email: data.user.email,
    role: (data.user as any).role,
  };
  return true;
}
```

### 4. Comprehensive Test Coverage

**Actual Test Structure:**

```
backend/src/
├── auth/
│   ├── auth.service.spec.ts         # Unit tests (321 lines)
│   └── auth.controller.spec.ts      # Controller tests (229 lines)
├── food-logs/
│   ├── food-logs.service.spec.ts    # Unit tests (251 lines)
│   ├── food-logs.controller.spec.ts # Controller tests (511 lines)
│   ├── food-logs.integration.spec.ts # Integration tests
│   └── food-logs.e2e.spec.ts        # End-to-end tests
└── test/
    ├── setup.ts                     # Test configuration
    └── integration.utils.ts         # Test utilities
```

**Real Test Examples (food-logs.service.spec.ts):**

```typescript
// Complex filter testing from actual codebase
it("should get food logs with filters", async () => {
  await service.getFoodLogs("user-1", {
    start_date: "2025-08-07T00:00:00Z",
    end_date: "2025-08-07T23:59:59Z",
    moods: ["happy"],
    food_name: "pizza",
    limit: 10,
    offset: 10,
  });

  expect(mockQuery.gte).toHaveBeenCalledWith(
    "meal_time",
    "2025-08-07T00:00:00Z"
  );
  expect(mockQuery.lte).toHaveBeenCalledWith(
    "meal_time",
    "2025-08-07T23:59:59Z"
  );
  expect(mockQuery.in).toHaveBeenCalledWith("moods", ["happy"]);
  expect(mockQuery.ilike).toHaveBeenCalledWith("food_name", "%pizza%");
  expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
});

it("should throw NotFoundException when food log not found", async () => {
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest
      .fn()
      .mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
  };
  mockSupabase.from.mockReturnValue(mockQuery as any);

  await expect(service.getFoodLogById("user-1", "999")).rejects.toThrow(
    NotFoundException
  );
});
```

## Documentation Standards

### API Documentation

- Swagger/OpenAPI specifications
- Example requests and responses
- Authentication requirements
- Error response formats

### Code Documentation

- TypeScript interfaces and types
- Inline comments for complex logic
- README files for each major module

## Quality Assurance

### Code Quality

- ESLint and Prettier for consistent formatting
- TypeScript for type safety
- Comprehensive error handling

### Security Measures

- Regular dependency updates
- Security-focused code reviews
- Environment variable management
- HTTPS enforcement

## Deployment Considerations

### Environment Configuration

- Separate development and production environments
- Secure environment variable management
- Database migration handling

### Performance Optimization

- Request-scoped clients for optimal resource usage
- Efficient database queries with RLS
- Image optimization (future: move to Supabase Storage)

## Future Roadmap

### Planned Enhancements

1. **Rate Limiting**: API protection against abuse
2. **Image Storage**: Migration from base64 to Supabase Storage
3. **Analytics**: Enhanced insights with D3 visualizations
4. **Premium Features**: Subscription-based feature gates
5. **Offline Support**: Local data synchronization
6. **Push Notifications**: User engagement features

### Technical Debt

- Implement global rate limiting
- Add comprehensive audit logging
- Enhance error monitoring and alerting
- Automated security scanning

## Lessons Learned

1. **Security First**: Implementing security at the architecture level (RLS) is more effective than application-level controls
2. **Type Safety**: TypeScript significantly improves development experience and reduces runtime errors
3. **Testing**: Comprehensive test coverage is essential for refactoring confidence
4. **Documentation**: Up-to-date documentation is crucial for team collaboration

## Code Analysis Tools

### Static Analysis and Quality Tools

**ESLint Configuration:**

```json
{
  "extends": ["@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "complexity": ["warn", 10],
    "max-lines-per-function": ["warn", 50]
  }
}
```

**Prettier Configuration:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**TypeScript Strict Mode:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}
```

### Testing and Coverage Tools

**Jest Configuration:**

```javascript
module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Complex Use Cases Implemented

1. **Request-Scoped Authentication**: Advanced security pattern ensuring RLS enforcement
2. **Multi-Modal Food Logging**: Complex form handling with image upload and mood tracking
3. **Mood Pattern Analysis**: Statistical correlation algorithms (demonstrated in example code)
4. **Type-Safe API Design**: Comprehensive DTO validation and error handling

## YAGNI Principle Applications

### What We Avoided Building

1. **Custom Authentication System**: Used Supabase Auth instead of building from scratch
2. **Complex State Management**: Used React Context instead of Redux for this scope
3. **Premature Optimizations**: No caching layer until proven necessary
4. **Over-Engineered UI**: Simple, functional components without unnecessary abstractions

### What We Built When Needed

1. **Request-Scoped Clients**: Only when RLS requirements became clear
2. **Comprehensive Testing**: As the codebase grew and reliability became critical
3. **Type Definitions**: Added as the API surface expanded

## Refactoring Assessment Criteria

This project demonstrates:

**Recognition of Code Smells**: Identified security, maintainability, and design issues  
 **Incremental Improvements**: Small, testable changes with clear progression  
 **YAGNI Principle**: Avoided over-engineering while meeting requirements  
 **Clean Code Principles**: Good naming, functions, types, and error handling  
 **SRP Compliance**: Each service and controller has a single, clear responsibility  
 **Test Coverage**: Comprehensive testing strategy with atomic commits  
 **Complex Logic**: Beyond basic CRUD - includes security patterns and business logic  
 **Documentation**: Clear setup instructions and technical explanations

---

_Last Updated: 18-08-2025_

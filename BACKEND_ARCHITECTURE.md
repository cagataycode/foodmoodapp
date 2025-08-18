# FoodMood Backend Architecture

This document explains the NestJS-based backend architecture for the FoodMood application.

## 🏗️ Architecture Overview

### **Backend (`foodmoodapp/backend/`)**

- **NestJS Framework**: Enterprise-grade Node.js framework with TypeScript
- **Authentication Module**: Supabase Auth integration with request-scoped clients
- **API Endpoints**: RESTful APIs with comprehensive Swagger documentation
- **Database Integration**: Supabase PostgreSQL with Row Level Security (RLS)
- **Validation**: Request validation with class-validator and DTOs
- **Security**: Guards, RLS policies, and request-scoped authentication
- **Testing**: Complete test suite with unit, integration, and e2e tests

### **Frontend (`foodmoodapp/frontend/`)**

- **UI Components**: React Native Expo app with custom components
- **API Client**: HTTP requests to NestJS backend with token management
- **State Management**: Authentication and app state with React Context
- **Token Storage**: Secure token storage with Expo SecureStore
- **Navigation**: Expo Router for screen navigation
- **Charts**: D3-based data visualization components

## 📁 Backend Structure

```
backend/
├── src/
│   ├── auth/                    # Supabase Auth integration module
│   │   ├── guards/             # SupabaseAuthGuard & PremiumGuard
│   │   ├── auth.controller.ts  # Auth endpoints with Swagger docs
│   │   ├── auth.service.ts     # Supabase Auth business logic
│   │   └── auth.module.ts      # Auth module with providers
│   ├── food-logs/              # Food logging module
│   │   ├── food-logs.controller.ts  # CRUD endpoints
│   │   ├── food-logs.service.ts     # Business logic with RLS
│   │   └── food-logs.module.ts      # Module definition
│   ├── health/                 # Health check endpoints
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── common/                 # Shared utilities
│   │   ├── dto/               # Request/Response DTOs
│   │   │   ├── auth.dto.ts
│   │   │   └── food-log.dto.ts
│   │   ├── services/          # Shared services
│   │   │   └── supabase-client.provider.ts
│   │   └── utils/             # Utility functions
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.types.ts      # Authentication types
│   │   ├── food-log.types.ts  # Food logging types
│   │   ├── user.types.ts      # User profile types
│   │   ├── database.types.ts  # Database schema types
│   │   ├── common.types.ts    # Shared types
│   │   ├── errors.types.ts    # Error handling types
│   │   └── index.ts           # Barrel exports
│   ├── test/                   # Test utilities
│   │   ├── integration.utils.ts
│   │   └── setup.ts
│   ├── app.module.ts           # Root application module
│   └── main.ts                # Application entry point
├── supabase/                   # Database configuration
│   ├── config.toml            # Supabase configuration
│   └── migrations/            # Database migrations
│       ├── 20240101000002_current_schema.sql
│       └── 20240101000003_add_mood_scores.sql
├── coverage/                   # Test coverage reports
├── jest.config.js             # Jest configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## 🔐 Authentication Flow

### **1. User Registration**

```
Frontend → POST /api/auth/register → NestJS Controller → AuthService → Supabase Auth → User Profile Creation
```

### **2. User Login**

```
Frontend → POST /api/auth/login → NestJS Controller → AuthService → Supabase Auth → Access & Refresh Tokens
```

### **3. Protected Requests**

```
Frontend → Bearer Token → SupabaseAuthGuard → Request-scoped Supabase Client → RLS-protected Query
```

### **4. Request-Scoped Authentication**

Each request creates a new Supabase client with the user's access token, ensuring Row Level Security (RLS) policies are enforced for all database operations.

## 🚀 Backend API Endpoints

### **Authentication Routes (`/api/auth`)**

| Method | Endpoint    | Description                 | Auth Required | RLS Enforced |
| ------ | ----------- | --------------------------- | ------------- | ------------ |
| POST   | `/register` | Register with Supabase Auth | No            | No           |
| POST   | `/login`    | Login with Supabase Auth    | No            | No           |
| GET    | `/me`       | Get current user profile    | Yes           | Yes          |
| PUT    | `/profile`  | Update user profile         | Yes           | Yes          |
| DELETE | `/account`  | Delete user account         | Yes           | Yes          |

### **Food Logs Routes (`/api/food-logs`)**

| Method | Endpoint | Description                       | Auth Required | RLS Enforced |
| ------ | -------- | --------------------------------- | ------------- | ------------ |
| GET    | `/`      | Get user's food logs with filters | Yes           | Yes          |
| POST   | `/`      | Create new food log entry         | Yes           | Yes          |
| GET    | `/:id`   | Get specific food log             | Yes           | Yes          |
| PUT    | `/:id`   | Update food log entry             | Yes           | Yes          |
| DELETE | `/:id`   | Delete food log entry             | Yes           | Yes          |

### **Health Routes (`/health`)**

| Method | Endpoint | Description        | Auth Required | RLS Enforced |
| ------ | -------- | ------------------ | ------------- | ------------ |
| GET    | `/`      | Application health | No            | No           |

### **Response Format**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "subscription_tier": "free"
    }
  }
}
```

## 🛠️ Setup Instructions

### **1. Backend Setup**

```bash
cd foodmoodapp/backend
npm install
cp env.example .env
# Edit .env with your Supabase credentials
npm run start:dev
```

### **2. Frontend Setup**

```bash
cd foodmoodapp/frontend
echo "EXPO_PUBLIC_API_URL=http://localhost:3001/api" >> .env
npm start
```

### **3. Environment Variables**

**Backend (.env):**

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env):**

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## 🛡️ Security Features

### **Backend Security**

- **Supabase Auth**: Secure authentication with access/refresh tokens
- **Guards**: Route protection with SupabaseAuthGuard and PremiumGuard
- **Row Level Security**: Database-level access control with RLS policies
- **Request-Scoped Clients**: Each request uses user-specific Supabase client
- **Validation**: Comprehensive request validation with class-validator DTOs
- **CORS**: Environment-specific CORS configuration
- **Environment Variables**: Secure secret management

### **Frontend Security**

- **Secure Token Storage**: Expo SecureStore for production token storage
- **API Error Handling**: Comprehensive error handling and user feedback
- **Input Validation**: Client-side form validation
- **Protected Routes**: Authentication-based route protection

## 🏗️ Key Implementation Details

### **Request-Scoped Supabase Client**

```typescript
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>
  ) {}
  // Each request gets a client with user's auth token
}
```

### **Row Level Security Integration**

```typescript
// All database queries automatically respect RLS policies
const { data: foodLogs } = await this.supabase
  .from("food_logs")
  .select("*")
  .eq("user_id", userId); // RLS ensures user only sees their data
```

### **Authentication Guard**

```typescript
@UseGuards(SupabaseAuthGuard)
@Post()
async createFoodLog(@Request() req, @Body() createFoodLogDto: CreateFoodLogDto) {
  // req.user contains authenticated user info
  return this.foodLogsService.createFoodLog(req.user.id, createFoodLogDto);
}
```

## 📈 Benefits of NestJS Architecture

### **1. Type Safety**

- Full TypeScript support
- Compile-time error checking
- IntelliSense and autocomplete

### **2. Modularity**

- Feature-based modules
- Dependency injection
- Reusable components

### **3. Built-in Features**

- Guards for authentication
- Interceptors for request/response transformation
- Pipes for validation
- Exception filters for error handling

### **4. Developer Experience**

- Auto-generated API documentation
- Hot reload in development
- Comprehensive testing utilities
- Built-in logging

### **5. Scalability**

- Easy to add new modules
- Clear separation of concerns
- Consistent patterns across the application

## 🧪 Testing the Setup

### **1. Health Check**

```bash
curl http://localhost:3001/health
```

### **2. API Documentation**

Visit: http://localhost:3001/api/docs

### **3. Backend API Test**

```bash
# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **4. Frontend Integration**

- Start both servers
- Try signing up/signing in
- Verify protected routes work
- Test logout functionality

## 🔄 Next Steps

1. **Add Real-time Features** - WebSocket integration for live updates
2. **Add File Upload** - Image handling for food photos (currently images are stored as base64 in DB)
3. **Add Analytics** - Usage tracking and metrics
4. **Add Caching** - Redis integration for performance
5. **Add Monitoring** - Application performance monitoring

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Passport.js Documentation](http://www.passportjs.org/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [Swagger Documentation](https://swagger.io/docs/)

## 🏗️ Module Architecture

### **Auth Module**

- Handles user authentication and authorization
- Manages JWT tokens and user sessions
- Provides guards for route protection

### **Food Logs Module**

- Manages food and mood logging
- Provides CRUD operations for food logs
- Generates statistics and reports

### **Insights Module**

- Generates AI-powered insights
- Analyzes food-mood patterns
- Provides personalized recommendations

### **Health Module**

- Provides health check endpoints
- Monitors application status
- Used for load balancers and monitoring

## 🛠️ Development Workflow

1. **Feature Development**: Create new modules following NestJS patterns
2. **Testing**: Write unit and e2e tests for all features
3. **Documentation**: Update API documentation automatically
4. **Code Quality**: Use ESLint and Prettier for consistent code style
5. **Deployment**: Build and deploy using production configuration

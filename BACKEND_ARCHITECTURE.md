# FoodMood Backend Architecture

This document explains the NestJS-based backend architecture for the FoodMood application.

## 🏗️ Architecture Overview

### **Backend (`foodmoodapp/backend/`)**

- **NestJS Framework**: Enterprise-grade Node.js framework with TypeScript
- **Authentication Module**: Custom JWT-based authentication with Passport (no Supabase Auth)
- **API Endpoints**: RESTful APIs with Swagger documentation
- **Database Integration**: Supabase PostgreSQL with type safety (database only)
- **Validation**: Request validation with class-validator
- **Security**: Guards, interceptors, and middleware

### **Frontend (`foodmoodapp/frontend/`)**

- **UI Components**: React Native screens and components
- **API Client**: HTTP requests to NestJS backend
- **State Management**: Authentication state with React Context
- **Token Storage**: Secure token management

## 📁 Backend Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── guards/             # Route protection guards
│   │   ├── strategies/         # Passport JWT strategy
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.service.ts     # Auth business logic
│   │   └── auth.module.ts      # Auth module definition
│   ├── food-logs/              # Food logging module
│   │   ├── food-logs.controller.ts
│   │   ├── food-logs.service.ts
│   │   └── food-logs.module.ts
│   ├── insights/               # AI insights module
│   │   ├── insights.controller.ts
│   │   ├── insights.service.ts
│   │   └── insights.module.ts
│   ├── health/                 # Health check endpoints
│   ├── common/                 # Shared utilities
│   │   └── dto/               # Data Transfer Objects
│   ├── types/                  # TypeScript type definitions
│   ├── app.module.ts           # Root application module
│   └── main.ts                # Application entry point
├── supabase/                   # Supabase configuration (database only)
├── package.json
└── env.example                 # Environment variables template
```

## 🔐 Authentication Flow

### **1. User Registration**

```
Frontend → POST /api/auth/register → NestJS Controller → AuthService → Supabase (DB) → Database
```

### **2. User Login**

```
Frontend → POST /api/auth/login → NestJS Controller → AuthService → Supabase (DB) → JWT Token
```

### **3. Protected Requests**

```
Frontend → Bearer Token → NestJS Guard → Controller → Service → Response
```

## 🚀 Backend API Endpoints

### **Authentication Routes (`/api/auth`)**

| Method | Endpoint    | Description              | Auth Required |
| ------ | ----------- | ------------------------ | ------------- |
| POST   | `/register` | Create new user account  | No            |
| POST   | `/login`    | Authenticate user        | No            |
| POST   | `/logout`   | Sign out user            | Yes           |
| GET    | `/me`       | Get current user profile | Yes           |
| PUT    | `/profile`  | Update user profile      | Yes           |
| DELETE | `/account`  | Delete user account      | Yes           |

### **Food Logs Routes (`/api/food-logs`)**

| Method | Endpoint | Description             | Auth Required |
| ------ | -------- | ----------------------- | ------------- |
| GET    | `/`      | Get user's food logs    | Yes           |
| POST   | `/`      | Create new food log     | Yes           |
| GET    | `/:id`   | Get specific food log   | Yes           |
| PUT    | `/:id`   | Update food log         | Yes           |
| DELETE | `/:id`   | Delete food log         | Yes           |
| GET    | `/stats` | Get food log statistics | Yes           |

### **Insights Routes (`/api/insights`)**

| Method | Endpoint            | Description               | Auth Required |
| ------ | ------------------- | ------------------------- | ------------- |
| GET    | `/`                 | Get user insights         | Yes           |
| GET    | `/:id`              | Get specific insight      | Yes           |
| POST   | `/generate/weekly`  | Generate weekly insights  | Yes           |
| POST   | `/generate/monthly` | Generate monthly insights | Yes           |
| PUT    | `/:id/read`         | Mark insight as read      | Yes           |
| DELETE | `/:id`              | Delete insight            | Yes           |

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

- **JWT Authentication**: Token-based authentication with Passport
- **Guards**: Route protection with JwtAuthGuard
- **Validation**: Request validation with class-validator
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Built-in request throttling
- **Helmet**: Security headers

### **Frontend Security**

- **Token Storage**: Secure token management
- **API Error Handling**: Graceful error responses
- **Input Validation**: Client-side validation
- **Automatic Token Refresh**: Session management

## 🔄 Migration from Express to NestJS

### **Before (Express.js)**

```javascript
// Express route
app.post("/api/auth/login", authMiddleware, async (req, res) => {
  // Manual validation
  // Manual error handling
  // Manual response formatting
});
```

### **After (NestJS)**

```typescript
// NestJS controller
@Post('login')
@UseGuards(JwtAuthGuard)
async login(@Body() loginDto: LoginDto) {
  // Automatic validation via DTOs
  // Automatic error handling via exception filters
  // Consistent response formatting
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

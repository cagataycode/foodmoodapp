# FoodMood Backend - NestJS

A modern, scalable backend for the FoodMood app built with NestJS, TypeScript, and Supabase.

## 🚀 Features

- **NestJS Framework**: Enterprise-grade Node.js framework with TypeScript
- **Supabase Integration**: PostgreSQL database with real-time subscriptions
- **JWT Authentication**: Secure token-based authentication
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Validation**: Request validation with class-validator
- **Rate Limiting**: Built-in request throttling
- **Testing**: Jest testing framework with coverage
- **Code Quality**: ESLint + Prettier for consistent code style

## 🏗️ Architecture

```
src/
├── auth/                    # Authentication module
│   ├── guards/             # Route protection guards
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module definition
├── common/                 # Shared utilities
│   └── dto/               # Data Transfer Objects
├── food-logs/             # Food logging module
├── insights/              # AI insights module
├── health/                # Health check endpoints
├── types/                 # TypeScript type definitions
├── app.module.ts          # Root application module
└── main.ts               # Application entry point
```

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🔧 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database setup**:
   ```bash
   # Start Supabase locally (if using local development)
   npm run supabase:dev
   
   # Push database schema
   npm run db:push
   
   # Generate TypeScript types
   npm run types:generate
   ```

## 🚀 Development

### Start development server:
```bash
npm run start:dev
```

### Build for production:
```bash
npm run build
npm run start:prod
```

### Code quality:
```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Available Auth Endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account

## 🛡️ Guards

- **JwtAuthGuard**: Protects routes requiring authentication
- **PremiumGuard**: Restricts access to premium features

## 📝 DTOs (Data Transfer Objects)

All API requests and responses use DTOs for validation and documentation:

- `RegisterDto` - User registration
- `LoginDto` - User login
- `UpdateProfileDto` - Profile updates
- `CreateFoodLogDto` - Food log creation
- `UpdateFoodLogDto` - Food log updates
- `FoodLogFiltersDto` - Food log filtering

## 🧪 Testing

### Unit Tests:
```bash
npm run test
```

### E2E Tests:
```bash
npm run test:e2e
```

### Test Coverage:
```bash
npm run test:cov
```

## 📦 Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build and Deploy:
```bash
npm run build
npm run start:prod
```

## 🔄 Migration from Express

This NestJS backend replaces the previous Express.js implementation with:

### Benefits:
- **Better Architecture**: Modular, scalable design
- **Built-in Features**: Guards, interceptors, pipes, decorators
- **Type Safety**: Enhanced TypeScript integration
- **Testing**: Better testing utilities
- **Documentation**: Auto-generated API docs
- **Validation**: Built-in request validation
- **Error Handling**: Centralized exception filters

### Key Changes:
- Express routes → NestJS controllers
- Express middleware → NestJS guards/interceptors
- Manual validation → class-validator decorators
- Manual JWT handling → Passport strategies
- Manual error handling → Exception filters

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new features
3. Update API documentation
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

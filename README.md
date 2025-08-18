# FoodMood App

A modern mobile application that helps users explore the connection between their eating habits and how they feel physically, mentally, and emotionally.

## 🍽️ About FoodMood

FoodMood is a React Native app with a NestJS backend that allows users to:

- Log their food intake with mood tracking
- Store food entries with images, portions, and detailed notes
- Track patterns between diet and emotional/physical well-being
- Generate AI-powered insights about their food-mood relationships
- Maintain a personal food and mood diary with multiple mood associations per meal

## 🏗️ Architecture

```
foodmoodapp/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Supabase Auth integration module
│   │   ├── food-logs/      # Food logging module
│   │   ├── health/         # Health check endpoints
│   │   ├── common/         # Shared DTOs, services, and utilities
│   │   ├── types/          # TypeScript type definitions
│   │   └── test/           # Test utilities and setup
│   └── supabase/           # Database migrations and configuration
├── frontend/               # React Native Expo app
│   ├── app/
│   │   ├── auth/           # Authentication screens (signin/signup)
│   │   ├── main/           # Main app screens (dashboard, profile, settings)
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client and authentication services
│   │   ├── contexts/       # React contexts for state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── constants/      # App constants and static data
│   └── assets/             # Images, icons, and static files
└── docs/                   # Documentation files
```

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (with request-scoped clients)
- **Validation**: class-validator with DTOs
- **Testing**: Jest with unit, integration, and e2e tests
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React Native + Expo (~53.0)
- **Language**: JavaScript/JSX
- **Navigation**: Expo Router
- **State Management**: React Context
- **UI**: Custom components with SVG support
- **Charts**: D3-based charting for insights
- **Storage**: Expo SecureStore for token management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account

### 1. Clone and Setup

```bash
git clone <repository-url>
cd foodmoodapp
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your Supabase credentials
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Environment Variables

**Backend (.env):**

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=3001
```

**Frontend (.env):**

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

## 📱 Features

### Authentication

- User registration and login using Supabase Auth
- Profile management with user preferences
- Secure token storage with Expo SecureStore
- Request-scoped authentication with Row Level Security

### Food Logging

- Log food items with customizable meal times
- Track multiple moods per meal (breakfast, lunch, dinner, snack)
- Add detailed notes and base64 images
- Portion size tracking

### User Experience

- Clean, intuitive dashboard interface
- Real-time food log updates
- Modal-based food entry system
- Profile customization and settings
- Secure authentication flow

## 🔐 API Endpoints

### Authentication (Supabase Auth Integration)

- `POST /api/auth/register` - Register new user with Supabase Auth
- `POST /api/auth/login` - Login user with Supabase Auth
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account

### Food Logs

- `GET /api/food-logs` - Get user's food logs with filtering
- `POST /api/food-logs` - Create new food log entry
- `GET /api/food-logs/:id` - Get specific food log
- `PUT /api/food-logs/:id` - Update food log entry
- `DELETE /api/food-logs/:id` - Delete food log entry

### Health

- `GET /health` - Health check endpoint

## 🧪 Development

### Backend Development

```bash
cd backend
npm install
npm run start:dev          # Start development server
npm run test               # Run unit tests
npm run test:integration   # Run integration tests
npm run test:e2e-full     # Run end-to-end tests
npm run lint              # Lint code
npm run format            # Format code
```

### Frontend Development

```bash
cd frontend
npm install
npm start                 # Start Expo development server
npm run ios              # Start iOS simulator
npm run android          # Start Android emulator
npm run web              # Start web version
```

### Database Management

```bash
cd backend
npm run supabase:dev     # Start local Supabase
npm run db:reset         # Reset database
npm run db:push          # Push migrations
npm run types:generate   # Generate TypeScript types
```

## 📚 Documentation

- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Frontend Authentication Guide](./frontend/AUTHENTICATION.md)
- [Threat Model & Security](./THREAT_MODEL.md)
- [API Documentation](http://localhost:3001/api/docs) (Swagger)

## 🚀 Deployment

### Backend Deployment

1. Build: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform

### Frontend Deployment

1. Build for production: `expo build`
2. Submit to app stores or distribute via Expo

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for better food-mood relationships**

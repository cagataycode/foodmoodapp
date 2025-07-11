# FoodMood App

A modern mobile application that helps users explore the connection between their eating habits and how they feel physically, mentally, and emotionally.

## 🍽️ About FoodMood

FoodMood is a React Native app with a NestJS backend that allows users to:

- Log their food intake and mood
- Track patterns between diet and emotional/physical well-being
- Generate AI-powered insights about their food-mood relationships
- Maintain a personal food and mood diary

## 🏗️ Architecture

```
foodmoodapp/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── food-logs/      # Food logging module
│   │   ├── insights/       # AI insights module
│   │   └── health/         # Health check endpoints
│   └── supabase/           # Database configuration
├── frontend/               # React Native app
│   ├── app/
│   │   ├── auth/          # Authentication screens
│   │   ├── main/          # Main app screens
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API client
│   │   └── contexts/      # React contexts
│   └── assets/            # Images and icons
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React Native + Expo
- **Language**: JavaScript/JSX
- **Navigation**: Expo Router
- **State Management**: React Context
- **UI**: Custom components

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

# Install dependencies
npm install

# Environment setup
cp env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
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

- User registration and login
- JWT token-based authentication
- Profile management
- Secure token storage

### Food Logging

- Log food items with timestamps
- Track mood before/after eating
- Add notes and photos
- Search and filter logs

### Insights

- AI-powered food-mood pattern analysis
- Weekly and monthly reports
- Personalized recommendations
- Trend visualization

### User Experience

- Clean, intuitive interface
- Offline capability
- Push notifications
- Dark mode support

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `DELETE /api/auth/account` - Delete account

### Food Logs

- `GET /api/food-logs` - Get user's food logs
- `POST /api/food-logs` - Create new food log
- `PUT /api/food-logs/:id` - Update food log
- `DELETE /api/food-logs/:id` - Delete food log
- `GET /api/food-logs/stats` - Get statistics

### Insights

- `GET /api/insights` - Get user insights
- `POST /api/insights/generate/weekly` - Generate weekly insights
- `POST /api/insights/generate/monthly` - Generate monthly insights
- `PUT /api/insights/:id/read` - Mark insight as read

## 🧪 Development

### Backend Development

```bash
cd backend

# Development server
npm run start:dev

# Run tests
npm run test

# Code quality
npm run lint
npm run format
```

### Frontend Development

```bash
cd frontend

# Start Expo
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Database Management

```bash
cd backend

# Generate types from Supabase
npm run types:generate

# Push migrations
npm run db:push
```

## 📚 Documentation

- [Backend README](./backend/README.md) - Detailed backend documentation
- [Frontend README](./frontend/README.md) - Frontend development guide
- [API Documentation](http://localhost:3001/api/docs) - Swagger UI (when server is running)

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

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

For support and questions:

- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for better food-mood relationships**

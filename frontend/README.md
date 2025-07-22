# FoodMood Frontend

A React Native mobile application built with Expo that helps users track their food intake and mood patterns.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Authentication**: Secure login/signup with JWT tokens (custom backend, not Supabase Auth)
- **Food Logging**: Log meals with mood tracking and base64 image storage
- **Insights**: AI-powered food-mood pattern analysis
- **Offline Support**: Works without internet connection
- **Cross-Platform**: iOS and Android support

## 🛠️ Tech Stack

- **Framework**: React Native 0.72+
- **Development**: Expo SDK 49+
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **API Client**: Custom fetch-based service
- **UI Components**: Custom components with React Native
- **Icons**: Custom SVG icons

## 📱 App Structure

```
app/
├── _layout.jsx              # Root layout with AuthProvider
├── index.jsx               # Home page with auth redirect
├── auth/                   # Authentication screens
│   ├── signin.jsx          # Sign in screen
│   └── signup.jsx          # Sign up screen
├── main/                   # Main app screens
│   ├── dashboard.jsx       # Food log dashboard
│   ├── profile.jsx         # User profile
│   └── settings.jsx        # App settings
├── components/             # Reusable components
│   ├── index.js            # Component exports
│   ├── TopBar.jsx          # Navigation header
│   ├── LogCard.jsx         # Food log card
│   ├── LogFoodModal.jsx    # Add/edit food log modal
│   ├── MoodPalette.jsx     # Mood selection component
│   └── ...                 # Other components
├── services/               # API and business logic
│   └── apiService.js       # Backend API client
├── contexts/               # React contexts
│   └── AuthContext.jsx     # Authentication state
├── utils/                  # Utility functions
│   └── dateUtils.js        # Date formatting helpers
├── constants/              # App constants
│   └── moodColors.js       # Mood color definitions
└── assets/                 # Static assets
    └── icons/              # SVG icons
```

## 🧰 Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the frontend directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Development Server

```bash
npm start
```

This will open the Expo development tools in your browser.

### 4. Run on Device/Simulator

- **iOS Simulator**: Press `i` in the terminal or click "Run on iOS simulator"
- **Android Emulator**: Press `a` in the terminal or click "Run on Android device/emulator"
- **Physical Device**: Scan the QR code with the Expo Go app

## 📱 Available Scripts

### Development

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web browser
```

### Building

```bash
npm run build      # Build for production
npm run eject      # Eject from Expo managed workflow
```

### Testing

```bash
npm test           # Run tests (if configured)
```

## 🔐 Authentication

The app uses JWT token-based authentication with the NestJS backend (custom, not Supabase Auth).

### Authentication Flow

1. **Sign Up**: User creates account with email, password, and username
2. **Sign In**: User authenticates with email and password
3. **Token Storage**: JWT token stored securely (in-memory for development)
4. **Protected Routes**: Dashboard, profile, and settings require authentication
5. **Auto Logout**: Token expiration handled automatically

### AuthContext Usage

```javascript
import { useAuth } from "../contexts/AuthContext";
const { user, signIn, signOut, isAuthenticated } = useAuth();
```

## 🍽️ Food Logging

### Features

- Add food items with timestamps
- Track mood before and after eating
- Add notes and descriptions
- Add photos (stored as base64 in DB)
- Search and filter logs
- View statistics and trends

### Components

- `LogFoodModal`: Add/edit food logs
- `LogCard`: Display individual food logs
- `DayGroup`: Group logs by day
- `MoodPalette`: Mood selection interface

## 🎨 UI Components

### Core Components

- `TopBar`: Navigation header with logo and actions
- `Avatar`: User profile picture component
- `LoadingScreen`: Loading state component
- `EmptyState`: Empty state placeholder

### Form Components

- `ProfileField`: Editable profile field
- `LogFoodModal`: Food logging modal
- `MoodPalette`: Mood selection component

### Layout Components

- `DayGroup`: Group food logs by day
- `LogCard`: Individual food log display
- `LogFoodButton`: Floating action button

## 🔌 API Integration

The app communicates with the NestJS backend through the `apiService.js`.

### API Service Features

- Automatic token management
- Request/response interceptors
- Error handling
- Retry logic
- Offline support

### Available Endpoints

- Authentication (register, login, logout, profile)
- Food logs (CRUD operations, statistics)
- Insights (generate, retrieve, mark as read)

## 🧩 State Management

### AuthContext

Manages authentication state and user data:

- User information
- Authentication status
- Login/logout functions
- Profile updates

### Local State

Component-level state for:

- Form data
- UI interactions
- Loading states
- Modal visibility

## 🧭 Navigation

Uses Expo Router for file-based navigation:

- `/` - Home page (redirects based on auth)
- `/auth/signin` - Sign in screen
- `/auth/signup` - Sign up screen
- `/main/dashboard` - Main dashboard
- `/main/profile` - User profile
- `/main/settings` - App settings

## 🎨 Styling

### Design System

- Consistent color palette
- Typography scale
- Spacing system
- Component variants

### Colors

- Primary: `#3498db` (Blue)
- Secondary: `#2c3e50` (Dark Blue)
- Background: `#f8f9fa` (Light Gray)
- Text: `#2c3e50` (Dark Blue)
- Success: `#27ae60` (Green)
- Error: `#e74c3c` (Red)

## 🧪 Testing

### Component Testing

```bash
npm test
```

### Manual Testing Checklist

- [ ] Authentication flow (signup, signin, logout)
- [ ] Food logging (add, edit, delete)
- [ ] Navigation between screens
- [ ] Offline functionality
- [ ] Error handling
- [ ] Performance on different devices

## 🚀 Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios
# Build for Android
expo build:android
```

### App Store Submission

1. Build the app using Expo EAS Build
2. Submit to App Store Connect (iOS)
3. Submit to Google Play Console (Android)

## ⚙️ Configuration

### Environment Variables

- `EXPO_PUBLIC_API_URL`: Backend API URL

### App Configuration

- `app.json`: Expo configuration
- `metro.config.js`: Metro bundler configuration

## 🐞 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --clear
   ```
2. **iOS Simulator not working**
   ```bash
   xcrun simctl boot "iPhone 14"
   ```
3. **Android Emulator issues**
   - Ensure Android Studio is properly configured
   - Check AVD Manager for emulator setup
4. **API connection issues**
   - Verify backend server is running
   - Check environment variables
   - Ensure correct API URL

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License.

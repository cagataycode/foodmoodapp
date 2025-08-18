# Authentication System

This document explains how authentication is implemented in the FoodMood app using Supabase Auth integration through a NestJS backend.

## Overview

The authentication system uses Supabase Auth through a NestJS backend with secure token management. It includes:

- User registration and login with Supabase Auth
- Access/refresh token management
- Automatic user profile creation
- Protected routes with request-scoped authentication
- Secure token storage with Expo SecureStore

## Components

### 1. AuthContext (`app/contexts/AuthContext.jsx`)

Manages authentication state throughout the app using React Context.

**Features:**

- User session management with React Context
- Supabase access/refresh token storage and validation
- Sign in/up/out functions with error handling
- Loading states and authentication checks
- Profile updates and account management

**Usage:**

```javascript
import { useAuth } from "../contexts/AuthContext";
const { user, signIn, signOut, isAuthenticated, updateProfile } = useAuth();
```

### 2. ApiService (`app/services/apiService.js`)

Handles all backend API communication including authentication.

**Authentication Functions:**

- `register(email, password, username)` - Create new user account
- `login(email, password)` - Authenticate user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user profile
- `updateProfile(updates)` - Update user profile
- `deleteAccount()` - Delete user account

### 3. Token Management

The app uses secure token storage for Supabase access/refresh tokens:

**Development (AsyncStorage):**

```javascript
// Tokens stored in AsyncStorage for development
await AsyncStorage.setItem("authToken", accessToken);
```

**Production (Secure Storage):**

```javascript
import * as SecureStore from "expo-secure-store";
await SecureStore.setItemAsync("authToken", accessToken);
// Refresh tokens handled automatically by Supabase
```

### 4. AuthGuard (Built into components)

Protects routes and handles authentication-based navigation.

**Features:**

- Redirects authenticated users to dashboard
- Redirects unauthenticated users to home
- Shows loading screen during auth check

### 5. LoadingScreen (`app/components/LoadingScreen.jsx`)

Reusable loading component for consistent UX.

## Setup

### 1. Backend Configuration

The app connects to your NestJS backend. Update the API URL in `app/services/apiService.js`:

```javascript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Database Schema

The Supabase database includes these key tables:

- `auth.users` (Supabase Auth table for user authentication)
- `user_profiles` (custom table for user data, linked to `auth.users` via RLS policies)
- `food_logs` (user food entries with mood tracking)
- `insights` (future AI-generated insights)

### 4. App Structure

The authentication flow is integrated into the Expo Router structure:

```
app/
├── _layout.jsx              # Root layout with AuthProvider
├── index.jsx               # Home page with auth redirect
├── auth/
│   ├── signin.jsx          # Sign in page with form validation
│   └── signup.jsx          # Sign up page with form validation
├── main/
│   ├── _layout.jsx         # Protected main layout
│   ├── dashboard.jsx       # Protected dashboard with food logs
│   ├── profile.jsx         # Protected user profile
│   ├── edit-profile.jsx    # Profile editing
│   ├── settings.jsx        # Settings with logout
│   └── insights.jsx        # Insights/analytics page
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── services/
│   ├── apiService.js       # Backend API client
│   └── authService.js      # Authentication helpers
├── hooks/
│   ├── useAuthForm.js      # Form handling hooks
│   └── useLogFoodSave.js   # Food logging hooks
└── components/
    ├── LoadingScreen.jsx   # Loading component
    ├── LogFoodModal.jsx    # Food entry modal
    └── auth/               # Auth-specific components
```

## Usage

### Sign Up

1. User navigates to signup page
2. Enters email, password, and username with client-side validation
3. NestJS backend registers user with Supabase Auth
4. User profile is automatically created via database trigger
5. Access/refresh tokens are received and stored securely
6. User is redirected to dashboard

### Sign In

1. User navigates to signin page
2. Enters email and password with validation
3. NestJS backend authenticates via Supabase Auth
4. Access/refresh tokens are received and stored
5. User context is updated with profile data
6. User is redirected to dashboard

### Sign Out

1. User goes to settings page
2. Taps logout button with confirmation
3. Backend logout endpoint is called (optional)
4. Access/refresh tokens are cleared from secure storage
5. User context is reset
6. User is redirected to home page

### Protected Routes

- Dashboard, Profile, and Settings are protected
- Unauthenticated users are redirected to home
- Authenticated users are redirected to dashboard

## API Integration

### Authentication Endpoints

The frontend communicates with these NestJS endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account

### Request Format

```javascript
// Example login request
const response = await apiService.login(email, password);
// Response format
{
  success: true,
  data: {
    user: {
      id: "user_id",
      email: "user@example.com",
      username: "username",
      subscription_tier: "free"
    },
    token: "jwt_token_here"
  }
}
```

### Token Management

JWT tokens are automatically included in API requests:

```javascript
const config = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};
```

## Error Handling

The authentication system includes comprehensive error handling:

- Invalid credentials
- Network errors
- Token expiration
- Profile creation failures
- Server errors
  All errors are displayed to users via Alert dialogs.

## Security Features

- JWT token-based authentication
- Secure token storage
- Automatic token validation
- Protected API endpoints
- Input validation
- Error sanitization

## Testing

To test the authentication system:

1. Start the backend: `cd backend && npm run start:dev`
2. Start the frontend: `cd frontend && npm start`
3. Try signing up with a new email
4. Sign in with the created account
5. Navigate to settings and test sign out
6. Verify protected routes work correctly

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**
   - Check email/password
   - Ensure account exists
   - Verify backend server is running
2. **"Failed to create account"**
   - Check email format
   - Ensure password meets requirements
   - Verify backend configuration
3. **"Network error"**
   - Check backend server is running
   - Verify API URL in environment variables
   - Check network connectivity
4. **"Token expired"**
   - Token is automatically cleared
   - User is redirected to login
   - Re-authentication required

### Debug Mode

Enable debug logging by checking the browser console or React Native debugger:

```javascript
console.error("API Request Error:", error);
```

## Migration from Supabase Direct Auth

### Before (Direct Supabase)

```javascript
// Direct Supabase calls
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

### After (NestJS Backend)

```javascript
// Backend API calls
const response = await apiService.login(email, password);
```

### Benefits of Migration

- Centralized authentication logic
- Better security control
- Consistent API responses
- Easier to add new auth methods
- Better error handling

## Best Practices

1. **Token Storage**: Use secure storage in production
2. **Error Handling**: Always handle authentication errors gracefully
3. **Loading States**: Show loading indicators during auth operations
4. **Validation**: Validate inputs on both client and server
5. **Security**: Never store sensitive data in plain text
6. **Testing**: Test authentication flow thoroughly

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh
2. **Biometric Auth**: Add fingerprint/face ID support
3. **Social Login**: Add Google, Apple, Facebook login
4. **Two-Factor Auth**: Implement 2FA for enhanced security
5. **Session Management**: Add session timeout and management

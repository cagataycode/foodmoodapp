# FoodMood App Threat Model & Cybersecurity Measures

## Threat Model

### 1. Assets

The FoodMood app processes and stores several types of sensitive and valuable data:

- **User Credentials**: Email addresses and passwords handled by Supabase Auth (never stored by our backend).
- **User Food Logs & Mood Data**: Personal records of food intake, meal times, mood associations, portion sizes, notes, and base64-encoded images.
- **User Profile & Subscription Data**: Usernames, email addresses, subscription tiers (free/premium), and profile preferences.
- **Access/Refresh Tokens**: Supabase-issued tokens for API authentication, stored securely on devices.
- **API Endpoints & Business Logic**: NestJS backend with request-scoped authentication and Row Level Security enforcement.
- **Database & Row Level Security**: Supabase PostgreSQL with comprehensive RLS policies protecting all user data.

### 2. Threat Actors

Potential adversaries who may attempt to compromise the system include:

- **External Attackers**: Unauthenticated users on the internet attempting to exploit vulnerabilities (e.g., via API abuse, brute force, or injection attacks).
- **Malicious Users**: Registered users who attempt to escalate privileges, access other users' data, or abuse premium features.
- **Insider Threats**: Developers, admins, or others with infrastructure access who may intentionally or accidentally leak or misuse data.
- **Automated Bots**: Scripts or bots that attempt credential stuffing, brute force, scraping, or denial-of-service attacks.

### 3. Attack Vectors

The main ways in which the system could be attacked include:

- **Credential Theft**: Attackers may try to steal user credentials via phishing, brute force, or credential stuffing.
  - _Example_: Automated bots try common passwords against the login endpoint.
- **API Abuse**: Attackers may attempt to access endpoints without proper authorization, or try to bypass rate limits.
  - _Example_: A user tries to access another user's food logs by guessing IDs.
- **Data Leakage**: Sensitive data could be exposed due to insecure storage, improper access controls, or verbose error messages.
  - _Example_: An API endpoint returns more data than intended, or error messages leak internal details.
- **Injection Attacks**: Unsanitized input could allow SQL injection or other code injection attacks.
  - _Example_: Malicious input in a food log entry attempts to bypass validation; while `supabase-js` uses parameterized queries, input should still be validated and length-limited to prevent abuse.
- **Token Theft or Replay**: If JWT tokens are intercepted or stolen, attackers could impersonate users.
  - _Example_: An attacker uses a stolen token to access protected endpoints.
- **Man-in-the-Middle (MITM) Attacks**: Without HTTPS, attackers could intercept or modify data in transit.
  - _Example_: A user on public Wi-Fi has their token intercepted if HTTPS is not enforced.
- **Denial of Service (DoS)**: Attackers may try to overwhelm the API with requests, degrading service for legitimate users.
  - _Example_: Automated scripts flood the API with requests, exhausting server resources.
  - Note: Large request bodies (up to 50 MB allowed for JSON) increase the risk of resource exhaustion.

### 4. Security Objectives

The FoodMood app aims to achieve the following security goals:

- **Confidentiality**: Ensure that only authorized users can access their own data, and that sensitive data is not exposed to unauthorized parties.
- **Integrity**: Prevent unauthorized modification of data, ensuring that food logs, moods, and profiles are accurate and trustworthy.
- **Availability**: Ensure the app and its APIs remain available to legitimate users, even under attack.
- **Authentication & Authorization**: Ensure that only legitimate users can log in, and that users can only access resources they are permitted to.
- **Input Validation & Sanitization**: Prevent injection and other attacks by strictly validating and sanitizing all user input.
- **Auditability**: Enable monitoring and logging to detect and respond to suspicious activity.
- **Secure Secrets Management**: Ensure that sensitive keys and secrets are never exposed or hardcoded, and are rotated as needed.

---

## Risk Assessment Overview

| Threat                                          | Impact   | Likelihood | Mitigation                                                                                          | Implemented     |
| ----------------------------------------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------- | --------------- |
| Brute-force attacks on login credentials        | High     | Medium     | Strong password policies (Supabase Auth); add API rate limiting and account lockouts; consider MFA. | Partial (No RL) |
| Weak password policies                          | Medium   | Medium     | Minimum length and complexity requirements (configured in Supabase Auth).                           | Yes             |
| Insecure storage of credentials                 | Critical | Low        | Backend does not store or hash passwords; Supabase Auth handles hashing and storage.                | Yes             |
| Data manipulation of food logs or mood entries  | Medium   | Medium     | DTO validation + application-level authorization checks (user-scoped queries).                      | Yes             |
| Unauthorized access to other users' data        | High     | Low        | Supabase access tokens; request-scoped Supabase client enforces RLS on all user requests.           | Yes             |
| Fraudulent manipulation of subscription status  | Medium   | Low        | `PremiumGuard` available; apply guard to premium routes; add audit logs (future).                   | Partial         |
| Cross-Site Scripting (XSS) via notes/inputs     | Medium   | Low        | Input validation and length limits on backend and frontend.                                         | Yes             |
| Storage and privacy of user data                | High     | Low        | HTTPS, env-based secrets, limited CORS in production.                                               | Yes             |
| Unauthorized access to/ modification of profile | Medium   | Low        | Supabase token auth, validation, user-scoped updates.                                               | Yes             |
| Basic Injection Attacks (e.g., SQL Injection)   | Critical | Low        | `class-validator` on DTOs; `supabase-js` parameterized operations (no raw SQL).                     | Yes             |
| Token theft or replay attacks                   | High     | Low        | Short-lived Supabase tokens, HTTPS, SecureStore on devices.                                         | Yes             |
| Denial of Service (DoS)                         | Medium   | Medium     | Add API rate limiting and request size controls; monitoring/scaling.                                | No              |

---

## Current Authentication Architecture

- **Supabase Auth Integration**: All authentication is handled by Supabase Auth through our NestJS backend, which acts as a secure proxy.
- **Request-Scoped Clients**: Each API request creates a new Supabase client with the user's access token, ensuring RLS policies are enforced.
- **Token Management**: Access and refresh tokens are managed by Supabase and stored securely on the client using Expo SecureStore.
- **No Custom JWT**: The backend no longer implements custom JWT handling - all tokens are Supabase-issued and validated.

---

## Implemented Cybersecurity Measures

### Backend (NestJS)

- **Authentication**: Request-scoped Supabase clients with user tokens ensure RLS enforcement on all database operations.
- **Role-based Access Control**: `SupabaseAuthGuard` protects all authenticated routes. `PremiumGuard` available for premium features.
- **Input Validation**: Comprehensive DTO validation with `class-validator`. Global `ValidationPipe` with whitelist and transform options.
- **Error Handling**: NestJS HTTP exceptions with consistent error responses and proper status codes.
- **Rate Limiting**: `@nestjs/throttler` dependency available but not yet configured globally.
- **CORS Configuration**: Environment-specific CORS settings with secure defaults for production.
- **Environment Variables**: All secrets loaded from environment variables. No hardcoded credentials.
- **Row Level Security**: All user data queries automatically respect RLS policies through request-scoped clients.
- **HTTPS Enforcement**: Required for production deployments with secure token transmission.
- **API Documentation**: Comprehensive Swagger documentation at `/api/docs` with authentication examples.
- **Testing**: Full test suite including unit, integration, and e2e tests with security validation.

### Frontend (React Native/Expo)

- **Secure Token Storage**: Production uses `expo-secure-store` for Supabase access tokens. Development uses AsyncStorage.
- **Token Management**: Access/refresh tokens automatically included in API requests with proper error handling.
- **Protected Routes**: Expo Router navigation protected by authentication context with automatic redirects.
- **Input Validation**: Comprehensive client-side form validation with real-time feedback.
- **Error Handling**: Structured error handling for all API calls with user-friendly error messages.
- **API Communication**: HTTPS enforced in production. Environment-based API URL configuration.
- **Context-based Authentication**: React Context manages authentication state with loading states and error handling.
- **No Hardcoded Secrets**: All configuration through environment variables and secure storage.

### Supabase

- **Row Level Security (RLS)**: Policies protect user-owned data. Backend uses user-scoped clients so RLS is enforced by default for user requests.
- **Service Role Key**: Used only on the backend, never exposed to the frontend.
- **Service Role Key Security**: Keep service role key in server env vars, rotate regularly, and restrict backend network access.
- **Limited API Exposure**: Only necessary schemas and endpoints are exposed.

---

## Future Enhancements

- **Rate Limiting**: Implement global API rate limiting with `@nestjs/throttler` for DOS protection
- **Image Storage**: Move base64 images to Supabase Storage with proper access controls and size limits
- **Token Refresh**: Implement automatic token refresh flow in the frontend
- **Premium Features**: Apply `PremiumGuard` to premium-only endpoints when subscription features are added
- **Audit Logging**: Implement comprehensive security event logging and monitoring
- **Dependency Management**: Automated dependency updates and vulnerability scanning
- **Penetration Testing**: Regular security assessments and vulnerability scans
- **Content Security**: Implement proper content validation for user-uploaded images
- **Session Management**: Advanced session management with device tracking and remote logout
- **Two-Factor Authentication**: Optional 2FA for enhanced account security

---

_Last updated: 18-08-2025_

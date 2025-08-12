# FoodMood App Threat Model & Cybersecurity Measures

## Threat Model

### 1. Assets

The FoodMood app processes and stores several types of sensitive and valuable data:

- **User Credentials**: Email addresses and user passwords submitted to the backend for registration/login (transiently handled, not stored or hashed by the backend; hashing and storage are handled by Supabase Auth).
- **User Food Logs & Mood Data**: Personal records of what users eat, when, and how they feel, which are sensitive health-related data.
- **User Profile & Subscription Data**: Includes usernames, subscription tier (free/premium) and other profile information.
- **Access Tokens (Supabase)**: Short-lived Supabase user tokens used to authenticate API requests; if stolen, could allow account takeover.
- **API Endpoints & Business Logic**: The backend logic that enforces access controls, data validation, and business rules.
- **Supabase Database & Storage**: The underlying database and storage where all user and app data resides.

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

## Notes on Password Security

- **Password Handling**: All password hashing, storage, and verification are performed by Supabase Auth. The backend receives raw passwords transiently for registration/login requests and forwards them to Supabase, but does not store or hash them.
- **Supabase Security**: Supabase Auth uses industry-standard password hashing and enforces password policies. For details, refer to Supabase's official documentation.
- **Backend Code**: The backend does not implement custom password hashing. The previous `bcryptjs` dependency has been removed.

---

## Implemented Cybersecurity Measures

### Backend (NestJS)

- **Authentication**: Backend verifies Supabase user tokens (no custom JWTs). A request-scoped Supabase client is created per request with the user's Authorization header so RLS applies to all DB queries.
- **Role-based Access Control**: `PremiumGuard` exists but is not currently applied to any routes.
- **Input Validation**: All DTOs use `class-validator`. Global `ValidationPipe` enforces whitelisting, forbids non-whitelisted properties, and transforms input types.
- **Error Handling**: NestJS HTTP exceptions are used. Custom error types exist but no global exception filter is configured.
- **Rate Limiting**: Not configured. Add `@nestjs/throttler` and apply a global guard.
- **CORS Configuration**: Development allows a broad set of localhost/Expo origins. Production uses `CORS_ORIGIN` env (default `http://localhost:3000`).
- **Environment Variables**: Supabase keys are loaded from environment variables and are not hardcoded. `JWT_SECRET` is no longer used.
- **Supabase Access**: RLS policies are defined and enforced at runtime by using a user-scoped Supabase client (anon key + user's token). Service role is reserved for admin/background tasks and tests.
- **HTTPS (Recommended)**: Enforce HTTPS in production deployments (reverse proxy or hosting config).
- **API Documentation**: Swagger docs enabled at `/api/docs` with Bearer auth.

### Frontend (React Native/Expo)

- **Secure Token Storage**: Implemented with `expo-secure-store` for Supabase access tokens.
- **Token Management**: Tokens are included in all API requests via the `Authorization` header.
- **Protected Routes**: Navigation and UI are protected by authentication context; unauthenticated users are redirected.
- **Input Validation**: Client-side validation for forms (e.g., email format, required fields).
- **Error Handling**: All API and authentication errors are caught and displayed to users.
- **API Communication**: All requests should use HTTPS in production via `EXPO_PUBLIC_API_URL`.
- **No Sensitive Data in Code**: No secrets or sensitive data are hardcoded in the frontend.

### Supabase

- **Row Level Security (RLS)**: Policies protect user-owned data. Backend uses user-scoped clients so RLS is enforced by default for user requests.
- **Service Role Key**: Used only on the backend, never exposed to the frontend.
- **Service Role Key Security**: Keep service role key in server env vars, rotate regularly, and restrict backend network access.
- **Limited API Exposure**: Only necessary schemas and endpoints are exposed.

---

## Future Enhancements

- Enforce HTTPS everywhere (backend and frontend deployments)
- Implement API rate limiting with `@nestjs/throttler` and consider IP/user-based policies
- Reduce JSON body limits and/or move images to object storage; validate and cap `image_base64` sizes
- Use secure storage for tokens on devices (`expo-secure-store`) and consider keychain/keystore
- Implement token refresh flow on the client (rotate `access_token` with `refresh_token`)
- Apply `PremiumGuard` to premium-only endpoints when introduced
- Ensure all user-facing DB calls use the user token; restrict service-role usage to privileged jobs
- Monitor and log security events (audit logging)
- Regularly review and update dependencies
- Perform periodic penetration testing and vulnerability scanning

---

_Last updated: 2025-08-12_

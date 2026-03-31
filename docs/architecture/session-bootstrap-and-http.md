# Session Bootstrap and HTTP Architecture

Last updated: 2026-03-31

## Bootstrap Flow

1. `main.ts` boots the app through shared `appConfig`.
2. `appConfig` registers `APP_INITIALIZER`.
3. The initializer calls `AuthService.initializeSession()`.
4. The app resolves into an authenticated or anonymous state before route protection decisions are made.

## Interceptor Design

- Non-API URLs pass through untouched.
- API requests are normalized to send credentials.
- Unsafe API methods receive the CSRF confirmation header automatically.
- A single refresh operation is shared across concurrent `401` responses.
- Logout requests are excluded from refresh retry handling to avoid loops during shutdown.

## Why This Matters

- Session restoration is now authoritative because it depends on backend cookies and `/Auth/profile`, not stale local state alone.
- Centralized API config avoids hard-coded backend URLs across services and interceptors.
- The frontend now matches the backend's browser-origin and CSRF requirements without pushing token bookkeeping into feature code.

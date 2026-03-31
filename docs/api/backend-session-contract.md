# Backend Session Contract

## Base URL

The Angular client now derives the API root from `environment.apiUrl` through `src/app/common/config/api.config.ts`.

## Request Rules

- All API requests are sent with `withCredentials: true`.
- Unsafe API requests automatically include `X-SeatLine-CSRF: 1`.
- The interceptor only applies auth/session behavior to URLs that match the configured API base URL.

## Session Endpoints

- `GET /Auth/profile`: validates and hydrates the current user during startup and guarded navigation
- `POST /Auth/refresh-token`: refreshes the cookie-backed session after a `401`
- `POST /Auth/logout`: terminates the backend session before client-side redirect

## Failure Behavior

- If refresh fails, the client clears session state and redirects to `/login` unless the app is still in the initialization phase.
- Queued requests wait on a single in-flight refresh attempt instead of firing duplicate refresh calls.

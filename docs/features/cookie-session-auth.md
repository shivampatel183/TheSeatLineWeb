# Cookie Session Authentication

Last updated: 2026-03-31

## What Changed

The frontend moved from a partly token-driven client model to a cookie-session model centered on backend validation.

## Current Behavior

- App startup calls `AuthService.initializeSession()` through `APP_INITIALIZER` before the main route tree is used.
- The service tracks auth state as one of:
  - `initializing`
  - `authenticated`
  - `anonymous`
- Route guards now wait for session initialization instead of checking only in-memory state.
- Logout posts to `/Auth/logout` and then clears client state even if the server call fails.

## Entry Screens

- The login and registration pages now explain the cookie-session account model with benefit panels instead of relying only on generic auth copy.
- Login still preserves `returnUrl` navigation and Google sign-in while fitting inside the viewport below the fixed navbar.
- Registration still posts to `/Auth/register`, but a `success: false` response now prefers the backend-provided `error` message instead of mapping HTTP status codes inside the component.

## State Handling

- `currentUser` remains a signal for active user data.
- The frontend still caches the user profile in `localStorage`.
- The app no longer depends on an in-memory access token for normal API calls or retry flows.

## Developer Notes

- Prefer `initializeSession()` for startup and guarded navigation decisions.
- Use `forceLogout()` only for failure handling paths where the session must be torn down immediately.
- See `features/auth-entry-experience.md` for the UI and layout details added on 2026-04-01.

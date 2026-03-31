# TheSeatLine Web Docs

Recent frontend implementation changes are documented here.

## Structure

- `features/`: user-visible behavior and app-level workflows
- `api/`: how the Angular client talks to the backend
- `architecture/`: bootstrap, state, and interceptor design

## Recently Documented Changes

- The app now initializes authentication state through an application bootstrap step instead of synchronous local restoration.
- API calls now centralize credentialed requests and CSRF header handling for unsafe backend operations.
- Logout is now server-aware and aligned with the backend cookie session model.

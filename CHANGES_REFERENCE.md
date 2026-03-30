# TheSeatLine Web Changes Reference

Last verified against the frontend code on 2026-03-30.

This file is a quick reference for the current frontend structure and the main functional areas that are already implemented.

## Active Feature Areas

| Area | Current Status | Main Files |
|---|---|---|
| Auth | live | `src/app/Auth`, `src/app/Component/google-login` |
| Event discovery | live | `src/app/Pages/home`, `src/app/Component/event-list` |
| Event detail | live | `src/app/Pages/event-detail` |
| Show listing | live | `src/app/Pages/event-shows` |
| Booking hold | partially live | `src/app/Pages/show-booking`, `src/app/common/Services/booking.service.ts` |
| Payment review | placeholder stage | `src/app/Pages/review-payment` |
| Booking history | live | `src/app/Pages/my-bookings` |
| Profile | live | `src/app/Pages/profile` |
| Venue detail | live | `src/app/Pages/venue-detail` |

## Current Architectural Notes

- The app uses standalone Angular components.
- Protected routes use `authGuard`.
- Session bootstrap happens in `app.component.ts` through `AuthService.initSession()`.
- The interceptor retries requests after cookie-based refresh when it receives `401`.
- The app is customer-facing only; there is no admin frontend.

## Important Integration Notes

- `ApiService` hardcodes `https://localhost:7243/api`.
- `environment.googleClientId` is used by Google sign-in.
- Home page city detection uses `ipapi.co`.
- Booking review depends on Angular router `state` and redirects home if opened directly without booking data.

## Known Incomplete Areas

- Payment is not fully wired from the review screen.
- Seat-wise booking UI is not implemented.
- Ticket categories rely on a controller that does not use the shared response wrapper.

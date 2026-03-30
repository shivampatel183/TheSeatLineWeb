# Troubleshooting

## App loads but API calls fail

Check:

- the API is running
- the API is reachable at `https://localhost:7243/api`
- the API allows `http://localhost:4200`

Why:

- the frontend currently ignores `environment.apiUrl`
- `ApiService` uses a hardcoded backend base URL

## Login appears to work but protected pages fail

Check:

- browser cookies are enabled
- the API successfully set `AccessToken` and `RefreshToken`
- the interceptor is retrying after `401`

Why:

- the current auth flow depends on both cookies and frontend session state

## Google login button does not appear

Check:

- `environment.googleClientId` is set correctly
- Google Identity Services loaded in the page
- browser extensions are not blocking Google scripts

## Review payment page redirects to home

This is expected if the route is opened directly or refreshed after the router state is lost.

Why:

- `review-payment.component` reads booking data from navigation state
- it does not re-fetch booking hold data by URL

## City is not auto-selected

Check:

- `ipapi.co` is reachable from the browser
- the detected city name matches one of the active cities from `/api/City`

If auto-detection fails, the user can still pick a city manually.

## Booking categories load but look inconsistent with other API responses

This is expected in the current code.

Why:

- `TicketCategoryController` does not use the shared `Response<T>` wrapper
- frontend code already contains a fallback mapper for this endpoint

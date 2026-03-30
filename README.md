# TheSeatLine Web

Angular 19 customer-facing frontend for TheSeatLine.

## Current Scope

The app currently supports:

- city-based event discovery
- event detail pages
- grouped show listings
- category-based booking holds
- payment review countdown screen
- email/password login
- Google login
- profile management
- booking history
- venue detail pages

## Main Routes

| Route | Purpose |
|---|---|
| `/` | home page and city selection |
| `/login` | login |
| `/register` | registration |
| `/profile` | authenticated profile |
| `/my-bookings` | authenticated booking history |
| `/event/:slug/:id` | event detail |
| `/event/:slug/:id/shows` | show listing |
| `/event/:slug/:id/shows/:showId/book` | booking selection |
| `/event/:slug/:id/shows/:showId/review` | booking hold review |
| `/venue/:id` | venue detail |

## Local Setup

### Prerequisites

- Node.js
- npm
- TheSeatLine API running locally

### Install

```bash
npm install
```

### Start

```bash
npm start
```

The Angular dev server runs at `http://localhost:4200/`.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Current Integration Notes

- `ApiService` currently hardcodes the backend base URL to `https://localhost:7243/api`.
- `environment.apiUrl` exists but is not wired into `ApiService`.
- Google login uses `environment.googleClientId`.
- Session handling depends on:
  - HTTP-only cookies from the API
  - in-memory access token state
  - cached user data in `localStorage`
- Home page city detection calls `https://ipapi.co/json/` directly from the browser.

## Current Gaps

- The review page is not yet connected to the live payment API flow.
- Seat-wise booking UI is not wired even though the backend supports it.
- There is no frontend admin panel for catalog management.

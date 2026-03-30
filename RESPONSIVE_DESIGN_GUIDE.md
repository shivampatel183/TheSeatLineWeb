# Responsive Design Guide

Last verified against the frontend code on 2026-03-30.

## Goal

The current Angular app is designed to work across mobile, tablet, and desktop for the customer journey:

- home discovery
- auth
- event browsing
- show selection
- booking hold review
- venue detail
- profile and booking history

## Current Responsive Principles in the Repo

### Route-first layouts

Each major page owns its own responsive layout instead of relying on one large page shell. This is visible in:

- `home.component`
- `event-detail.component`
- `event-shows.component`
- `show-booking.component`
- `review-payment.component`
- `profile.component`
- `my-bookings.component`

### Shared shell

`app.component.html` provides the stable app shell:

- navbar
- routed content
- footer
- toast container

### Mobile-first behavior

The app already includes:

- a mobile-aware navbar
- responsive Google login button sizing
- route layouts that collapse cleanly to one column
- booking and event cards sized for smaller screens

## Areas That Depend on Responsive Behavior

### Home

- city selection popup must remain usable on small screens
- event browsing needs readable card density at mobile widths

### Event detail

- image gallery and meta sections need to stack cleanly
- performer and status sections need to remain readable without overflow

### Event shows

- grouped date accordions should remain easy to tap
- show action buttons should stay accessible on compact screens

### Booking

- category counters must remain tap-friendly
- summary areas must stay readable while the user changes quantity

### Review payment

- hold countdown and pricing summary should remain visible without crowding

## Current Design Constraints

- the app mixes Tailwind utility usage with component-level CSS and SCSS
- there is no centralized design token file for spacing, radius, or type scale
- some flows still depend on router state, which is more fragile on refresh-heavy mobile use

## Recommended Rule for Future UI Work

When updating frontend screens, validate at minimum:

- 360px width
- 768px width
- 1280px width

Also verify:

- keyboard accessibility
- focus visibility
- auth and toast overlays
- long titles and long venue names

# Responsive Quickstart

Use this guide when making UI changes in `TheSeatLineWeb`.

## Start Here

1. Identify the route or shared component you are changing.
2. Check whether the screen is part of the customer-critical flow:
   - login
   - register
   - home
   - event detail
   - event shows
   - booking
   - payment review
   - profile
   - my bookings
3. Test the change at mobile, tablet, and desktop widths.
4. Re-check navbar, footer, and toast overlays after the page change.

## Useful Commands

```bash
npm start
```

```bash
npm run build
```

```bash
npm test
```

## Current Frontend Constraints to Remember

- API base URL is hardcoded in `ApiService`.
- Protected routes depend on auth state and `returnUrl`.
- Review-payment depends on router state and may redirect home if refreshed directly.
- Google login rendering depends on browser width and the configured client id.

## Good Defaults for New UI Work

- prefer vertical stacking on narrow screens
- keep primary actions visible without horizontal scrolling
- avoid fixed heights for data-driven cards
- test long event names, venue names, and toast messages

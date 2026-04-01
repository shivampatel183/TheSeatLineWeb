# Authentication Entry Experience

Last updated: 2026-04-01

## What Changed

The login and registration screens were reworked to better explain the account value proposition, fit reliably under the fixed navbar, and keep shared auth behavior aligned with the cookie-session model introduced on 2026-03-31.

## Login Screen Behavior

- The login route now renders as a responsive two-panel layout on large screens and collapses to a single card on smaller screens.
- `returnUrl` handling is unchanged: authenticated users still redirect immediately, and successful login still navigates back to the requested route.
- The supporting copy is now driven by the `accountBenefits` array in the component so product messaging can change without restructuring the template.
- Password visibility toggling, remember-me input, and Google sign-in remain part of the standard login flow.

## Registration Screen Behavior

- Registration fields are split into a denser responsive layout: name and email stay in the main grid, while password and confirm-password fields share a dedicated row.
- The right-side marketing panel remains driven by `marketingBenefits`, which keeps non-functional copy changes in component state instead of duplicated markup.
- Successful registration still routes the user to `/login`.
- When the backend returns `success: false`, the UI now prefers `response.error` for the toast message instead of translating status codes in the component.

## Shared Layout Notes

- Global styles now expose `--navbar-height` so auth pages can size themselves with `calc(100dvh - var(--navbar-height))`.
- The auth page shell now uses `overflow-hidden` and tighter spacing so desktop layouts stay within the viewport while the fixed navbar remains visible.
- Shared utility classes were added for password toggles, full-width grid spans, Google auth placement, and panel footer content.

## Developer Notes

- Update `accountBenefits` and `marketingBenefits` when changing auth-page product messaging; avoid hard-coding the same text directly in the templates.
- Keep auth page content compact enough to respect the fixed-height shell, especially before adding extra validation or legal copy blocks.
- If backend registration failures need richer UX again, centralize that policy in the auth service or a shared mapper instead of rebuilding per-status handling in the component.

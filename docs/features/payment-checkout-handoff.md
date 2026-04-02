# Payment Checkout Handoff

Last updated: 2026-04-02

## What Changed

The review-payment screen now performs a real payment-order initiation call instead of acting as a placeholder button.

## Current Behavior

- `ReviewPaymentComponent.proceedToPay()` now exits early when the booking is missing, the reservation has expired, or a payment request is already in flight.
- The component calls `PaymentService.createOrder()` with the current booking ID and a request object that currently defaults `gatewayProvider` to `phonepe`.
- When the browser environment is available, the page sends the current URL as `returnUrl` so the backend can route payment completion back to the originating page.
- If the backend returns `checkoutUrl`, the browser is redirected immediately with `window.location.assign(...)`.
- If checkout data is missing, the user now gets a warning toast instead of a silent no-op.

## Error Handling

- Payment creation clears the processing state in `finalize(...)`, even when the request fails.
- Backend validation or gateway initiation failures now prefer the backend `message` or `error` field from `HttpErrorResponse`.
- Unknown failures still collapse to a generic "Unable to start payment" toast.

## Developer Notes

- Keep the payment initiation request lightweight; the booking review page assumes the booking summary has already been loaded from router state.
- If payment provider selection becomes user-configurable, extend the request DTO rather than hard-coding provider logic in the component.
- Use the shared payment DTOs in `src/app/common/model/api.model.ts` for any future verification, callback, or refund UI work.

# Responsive Testing Guide

Use this checklist when validating UI changes in `TheSeatLineWeb`.

## Viewports

Test at minimum:

- 360 x 800
- 768 x 1024
- 1280 x 800

## Core Route Checklist

### Home

- city selector is usable
- event cards do not overflow
- navbar stays usable

### Login and Register

- fields remain readable
- password toggles stay aligned
- Google button renders correctly

### Event Detail

- gallery remains navigable
- status and metadata do not overlap
- primary CTA remains visible

### Event Shows

- grouped dates expand and collapse correctly
- available and unavailable states remain obvious

### Booking

- quantity controls remain easy to tap
- error and warning toasts do not hide critical actions
- summary totals remain readable

### Review Payment

- countdown remains visible
- pricing summary does not overflow
- direct refresh behavior is acceptable for the current router-state design

### Profile and My Bookings

- loading states display properly
- cards and sections do not overflow with long data

## Functional Checks

- login redirect returns to the intended protected page
- session refresh after `401` still works
- toasts remain visible above page content
- city selection persists across reloads

## Current Known Non-Final Areas

- live payment flow is not fully integrated
- seat-wise booking UI is not active yet

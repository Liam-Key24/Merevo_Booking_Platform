# Password reset / account recovery — scope (Stage 8)

**Status:** Not implemented (`PASSWORD_RESET_AVAILABLE = false`).  
**Product:** Merevo booking platform (`Merevo_Booking_Platform`).  
**Related bug:** Implement a usable account-recovery flow (Notion).

## Current behaviour

- `src/lib/auth/password-reset.ts` keeps the feature flag **off**.
- `LoginForm` can show “Forgot password?” after failed attempts via `shouldShowForgotPassword`, but the href (`/login/forgot-password`) has **no route** and must stay hidden until the flag is flipped.
- There is no token store, email template, or reset completion page.

## Recommended v1 scope (Supabase Auth)

Merevo already uses Supabase for staff auth. Prefer the built-in recovery flow over a custom token table.

| Step | Behaviour |
|---|---|
| 1. Request | `POST` (or server action) accepts email only; always returns a generic success message (no account enumeration). |
| 2. Email | Supabase sends the recovery link (configure redirect URL allow-list to `/login/reset-password`). |
| 3. Complete | Page at `/login/reset-password` reads the recovery session/hash and sets a new password with length + confirmation validation. |
| 4. Expiry / invalid | Show a clear error and link back to request form; never reveal whether the email exists. |
| 5. Flag | Set `PASSWORD_RESET_AVAILABLE = true` only after routes + email templates are live in staging. |

## Rate limiting

Server-side limits remain authoritative; the login “forgot password?” hint is UX only.

- **Booking / IP limits:** `src/lib/booking/rate-limit.ts` (Upstash sliding window when configured; in-memory fallback for local/dev). Recovery request endpoints must use the same durable limiter pattern once implemented (per IP and/or per normalised email), including production fail-closed behaviour when Redis is unavailable.
- **Failed-attempt UX:** `src/lib/auth/failed-attempts.ts` increments a **client-only** counter to decide when to show the hint via `shouldShowForgotPassword`. It is **not** an auth or rate-limit boundary — provider/server limits still apply.

## Tenant / business context

Password reset is for **staff auth accounts**, not public booking guests. Isolation rules in `docs/tenant-isolation.md` still apply after recovery: a reset user may only access businesses they are a member of (RLS + membership). Do not email or reveal other tenants’ data in recovery copy or errors. Seed/admin accounts documented there remain local/dev only.

## Out of scope for v1

- SMS / phone recovery  
- Admin-forced reset without email  
- Reset while signed in (change-password under account settings can be a follow-up)  
- Custom HMAC token store (unless Supabase recovery cannot be used)

## Tests required before enabling the flag

- Request with unknown email still returns the generic success UI  
- Expired / invalid recovery link shows error, no password change  
- Valid recovery can set a new password and sign in  
- `LoginForm` shows “Forgot password?” only when `PASSWORD_RESET_AVAILABLE` is true (existing `login-form-reset` suite)

### No real email sent in tests

Unit/integration suites must **never** call live Resend, Supabase mail, or SMTP. Mock the recovery mail/send path (and related clients) so tests assert behaviour only. Align with existing email safety contracts in `tests/email-delivery-safety.test.ts` and the login form suites — no network sends, no side effects on real inboxes.

## Decision needed from Liam

1. Confirm **Supabase recovery** as the v1 mechanism (recommended).  
2. Confirm production redirect URL(s) for the recovery email.  
3. Confirm Resend/SMTP vs Supabase’s built-in mail for recovery messages.

Once decided, implementation is a focused follow-up (routes + actions + flip flag + tests) — not blocked by Stages 6–7.

# Social Cup - Phase 1 Architecture

> Status: Approved implementation baseline
>
> This document describes how the technologies already selected for Social Cup
> work together. Product behavior remains defined by
> `PRODUCT_AND_BUSINESS_RULES.md`.

## 1. Scope

Phase 1 delivers the Dallas coffee network MVP:

- Member mobile app for discovery, membership, credits, redemptions, ratings,
  history, and profile.
- Barista mobile web scanner for café PIN authentication and counter
  redemptions.
- Administrator web panel for cafés, drinks, members, ratings, audit, and
  payouts.
- Express API backed by PostgreSQL 16.
- Stripe subscription billing and verified webhooks.

Redis, BullMQ, PostGIS, and WebSockets are intentionally excluded from Phase 1.
PostgreSQL transactions, PostgreSQL advisory/row locks, and client polling are
the approved alternatives.

## 2. Runtime Components

```text
Expo mobile app       \
Admin React/Vite SPA    ---> Express API ---> PostgreSQL 16
Barista React/Vite SPA /
                                      |
                                      +--> Stripe
                                      +--> Email provider
                                      +--> Object storage
                                      +--> Google/Apple identity providers
```

The frontends do not access PostgreSQL or third-party secret APIs directly.
They communicate with the API over HTTPS and receive JSON responses.

## 3. Repository Boundaries

```text
apps/api
  HTTP routes, authentication, authorization, domain services, database access

apps/mobile
  Member-facing Expo application

apps/admin-web
  Administrator-facing React/Vite application

apps/barista-web
  Barista-facing React/Vite scanner application

packages/shared
  API contracts, domain enums, validation schemas, and framework-agnostic types
```

The API is the only owner of business rules. Frontends may provide early UX
validation, but they must not be trusted for balances, membership eligibility,
token expiry, permissions, payout amounts, or state transitions.

## 4. API Conventions

All application routes use the `/api/v1` prefix.

### Response shape

Successful responses return the resource directly or an explicit collection:

```json
{
  "data": {},
  "meta": {}
}
```

Errors use a stable machine-readable code:

```json
{
  "error": {
    "code": "NOT_ENOUGH_CREDITS",
    "message": "The member does not have enough credits for this drink.",
    "request_id": "..."
  }
}
```

The API must never expose password hashes, PIN hashes, refresh-token hashes,
redemption-token hashes, or Stripe secrets.

### Initial route groups

```text
GET    /health

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me

GET    /api/v1/cafes
GET    /api/v1/cafes/:cafeId
GET    /api/v1/cafes/:cafeId/drinks

POST   /api/v1/redemptions/tokens
GET    /api/v1/redemptions/active
POST   /api/v1/barista/pin/session
POST   /api/v1/barista/redemptions/scan
GET    /api/v1/barista/redemptions/today

POST   /api/v1/ratings
GET    /api/v1/me/diary

POST   /api/v1/billing/checkout
POST   /api/v1/billing/portal
POST   /api/v1/billing/cancel
POST   /api/v1/billing/resume
POST   /api/v1/webhooks/stripe

GET    /api/v1/admin/cafes
POST   /api/v1/admin/cafes
PATCH  /api/v1/admin/cafes/:cafeId
POST   /api/v1/admin/cafes/:cafeId/reset-pin
GET    /api/v1/admin/drinks
POST   /api/v1/admin/drinks
PATCH  /api/v1/admin/drinks/:drinkId
GET    /api/v1/admin/members
GET    /api/v1/admin/ratings
PATCH  /api/v1/admin/ratings/:ratingId/moderation
GET    /api/v1/admin/audit/redemptions
POST   /api/v1/admin/redemptions/:redemptionId/void
GET    /api/v1/admin/payouts
POST   /api/v1/admin/payouts/generate
POST   /api/v1/admin/payouts/:batchId/approve
POST   /api/v1/admin/payouts/:batchId/pay
GET    /api/v1/admin/payouts/:batchId.csv
```

## 5. Authentication and Authorization

The approved identity model separates `users` from `user_identities`.

- Email/password, Google, and Apple identities map to one user.
- Password credentials are hashed with Argon2id.
- Access tokens are short-lived JWTs.
- Refresh tokens are random, hashed with SHA-256 in PostgreSQL, and revocable.
- Admin routes require an administrator role and the selected admin 2FA policy.
- Barista devices do not have member accounts. A successful café PIN exchange
  creates an HTTP-only device cookie tied to the café's current `pin_version`.
- A café PIN reset invalidates all prior barista device sessions.

Authorization is enforced in API middleware and repeated in domain services
where a write affects money, credits, or audit history.

## 6. Redemption Transaction

`POST /api/v1/barista/redemptions/scan` must execute one database transaction:

1. Authenticate the barista device and identify its café.
2. Resolve the submitted QR token or backup code to a token hash.
3. Lock the pending token row with `FOR UPDATE`.
4. Verify status, exact server expiry, and café ownership.
5. Lock the member balance row with `FOR UPDATE`.
6. Verify account and subscription entitlement.
7. Verify sufficient credits.
8. Insert the immutable redemption snapshots.
9. Insert the `DEDUCT_REDEMPTION` ledger entry.
10. Mark the token `REDEEMED`.
11. Store the idempotency result.
12. Commit and return the green confirmation.

Any failure rolls back the complete transaction and returns one PDC-defined
error code. A retry with the same `idempotency_key` returns the original result.

## 7. Member Polling

After token generation, the mobile app calls
`GET /api/v1/redemptions/active` every 1.5 seconds while the redemption screen
is open. The API returns the token status and, when redeemed, the redemption
summary. Polling stops on `REDEEMED`, `EXPIRED`, or `SUPERSEDED`.

The member phone does not need to remain online after the token is generated.
The barista device remains the online participant in the counter transaction.

## 8. Stripe Webhooks

The Stripe webhook route receives the raw request body. It verifies the Stripe
signature before JSON processing and stores each event ID in a deduplication
table.

`invoice.payment_succeeded` is the only authority for a successful recurring
credit grant. The handler runs a transaction that:

- records the invoice event once;
- updates the subscription;
- creates the billing period;
- sets the operational balance to 30 through a ledger grant;
- uses the unique ledger `idempotency_key` to prevent duplicate grants.

Cron jobs must not grant credits independently.

## 9. Financial Rules

- Money is stored as integer cents.
- Credit costs are positive integers.
- Current balances cannot be negative.
- Every balance mutation has an append-only ledger entry.
- Redemptions store café, drink, price, credit, payout-rate, payout, and margin
  snapshots.
- Paid payout batches are immutable.
- Voids before settlement remove the accrued liability.
- Voids after settlement create a future clawback adjustment.
- Credit restoration depends independently on whether the original billing
  period is still open.

## 10. Development and Free Tools

The implementation should remain runnable locally without paid services:

- PostgreSQL 16 local installation for development.
- pgAdmin or DBeaver Community for database inspection.
- Stripe test mode and Stripe CLI for local webhook forwarding.
- Expo Go for mobile testing.
- Chrome device emulation for barista web testing.
- Vitest and Supertest for API tests.
- Playwright after the first API-backed vertical slice is stable.

External production vendors for email, object storage, hosting, and managed
PostgreSQL remain TBD until explicitly selected and recorded in the project
specification.

# Social Cup — Project Specification

> **Status:** Technical/Project-Level Source of Truth (Foundation Phase)
> **Last Updated:** 2026-09-09
> **Scope:** Phase 1 Foundation — Dallas Coffee Network prototype

## Purpose

This document is the **technical/project-level** source of truth. It connects the business specification to the eventual implementation:

```
PRODUCT_AND_BUSINESS_RULES.md   (WHAT the product must do)
            ↓
PROJECT_SPECIFICATION.md        (WHAT the system is, WHAT technologies are established)
            ↓
Architecture / schema / implementation
```

It does **not** restate business rules, financial invariants, or state machines — those live in `PRODUCT_AND_BUSINESS_RULES.md` and are only cross-referenced here by section number. This document answers a different question: *what technology exists, what is planned, and what is still undecided.*

Every statement of fact below is either (a) evidenced by a specific file in this repository, cited inline, or (b) explicitly labeled as specified-only, planned, or TBD. Nothing here should be read as "implemented" unless it says CONFIRMED.

---

## Table of Contents

1. [Project Identity](#1-project-identity)
2. [Confirmed Technology Stack](#2-confirmed-technology-stack)
3. [Planned Architecture](#3-planned-architecture)
4. [Database](#4-database)
5. [External Integrations](#5-external-integrations)
6. [Security Architecture Status](#6-security-architecture-status)
7. [Runtime Architecture](#7-runtime-architecture)
8. [Development and Delivery Tooling](#8-development-and-delivery-tooling)
9. [Testing Strategy Status](#9-testing-strategy-status)
10. [Infrastructure Status](#10-infrastructure-status)
11. [Architectural Principles](#11-architectural-principles)
12. [Confirmed / Planned / TBD Matrix](#12-confirmed--planned--tbd-matrix)
13. [Relationship to Other Project Documents](#13-relationship-to-other-project-documents)
14. [Change-Control Rules](#14-change-control-rules)
15. [Source References](#15-source-references)

---

## 1. Project Identity

Social Cup is a Dallas-area coffee membership platform: members pay a flat monthly subscription for drink credits, redeem those credits for drinks at participating cafés via a counter QR/backup-code flow, and the platform tracks credit ledgers, café payouts, and ratings. Full behavioral detail lives in `PRODUCT_AND_BUSINESS_RULES.md`.

The repository currently implements **four application surfaces**:

| Surface | Directory | Role |
|---|---|---|
| Member mobile app | `apps/mobile` | Discovery, onboarding, redemption, membership, ratings, history (Expo/React Native) |
| Admin web | `apps/admin-web` | Platform administration: cafés, drinks, members, subscriptions, ratings, payouts, audit (React + Vite SPA) |
| Barista web | `apps/barista-web` | Counter scanner: PIN entry, scan/redeem, shift history (React + Vite web app) |
| Backend API | `apps/api` | Server-side API (Express) |

**This repository is currently a prototype/foundation state, not a working product.** Every frontend (`apps/mobile`, `apps/admin-web`, `apps/barista-web`) holds its own local, in-memory mock state and makes **no network calls** to any backend — no `fetch`/`axios` usage exists in any of the three frontend codebases. `apps/api` is a standalone Express skeleton exposing exactly one route (`GET /health`) and is not called by any frontend. **The four surfaces are not integrated with each other.** This is documented in detail in the Technology & Integration Inventory audit that preceded this document and is reflected throughout §7 and §12 below.

---

## 2. Confirmed Technology Stack

Every entry below is a direct dependency of a `package.json` in this repository. Status is `CONFIRMED` for all rows in this section — see §12 for the full matrix including planned/TBD items.

| Technology | Purpose | Application/Layer | Status |
|---|---|---|---|
| **npm workspaces monorepo** | Single-repo management of `apps/*` and `packages/*` | Repository-wide | CONFIRMED — root `package.json` `"workspaces": ["apps/*", "packages/*"]`, `package-lock.json` |
| **Node.js ≥24** | JavaScript/TypeScript runtime | All apps | CONFIRMED — root `package.json` `"engines": {"node": ">=24.0.0"}` |
| **TypeScript ~5.9.3** | Static typing, strict mode | All apps | CONFIRMED — root `tsconfig.json` (`"strict": true`), each app's `package.json`/`tsconfig.json` |
| **Expo / React Native** | Mobile app framework | `apps/mobile` | CONFIRMED — `apps/mobile/package.json` (`expo ~57.0.21`, `react-native 0.86.3`, `react 19.2.3`) |
| **React 19 + Vite** | Admin SPA framework/build tool | `apps/admin-web` | CONFIRMED — `apps/admin-web/package.json` (`react ^19.2.8`, `vite ^8.2.2`, `@vitejs/plugin-react ^6.1.1`) |
| **React 19 + Vite** | Barista scanner SPA framework/build tool | `apps/barista-web` | CONFIRMED — `apps/barista-web/package.json` (same versions as admin-web) |
| **Express 5 + TypeScript** | HTTP API framework | `apps/api` | CONFIRMED — `apps/api/package.json` (`express ^5.2.1`); implements one route, `GET /health` (`apps/api/src/app.ts`) |
| **node-postgres (`pg`)** | PostgreSQL driver and explicit transaction/locking access | `apps/api` | CONFIRMED — `apps/api/package.json`; pool foundation in `apps/api/src/db.ts` |
| **Zod** | Runtime validation and shared API request schemas | `apps/api`, `packages/shared` | CONFIRMED — shared schemas in `packages/shared/src/index.ts` |
| **Jose** | JWT implementation | `apps/api` | CONFIRMED dependency; authentication routes not implemented yet |
| **Pino / pino-http** | Structured API logging | `apps/api` | CONFIRMED dependency; request logging not wired yet |
| **Vitest + Supertest** | API test runner + HTTP assertions | `apps/api` | CONFIRMED — `apps/api/package.json` (`vitest ^5.0.0`, `supertest ^7.2.2`); one test file, `apps/api/src/app.test.ts` |
| **ESLint** | Linting | Repository-wide | CONFIRMED — root `package.json` (`eslint ^10.10.0`, `typescript-eslint ^8.70.0`), flat config at `eslint.config.js` |
| **Prettier** | Code formatting | Repository-wide | CONFIRMED — root `package.json` (`prettier ^3.9.6`), config at `.prettierrc.json` |
| **GitHub Actions CI** | Continuous integration | Repository-wide | CONFIRMED — `.github/workflows/ci.yml` (lint, typecheck, test, build on push/PR to `main`) |

Other runtime dependencies are limited to the application libraries and direct
supporting packages listed in workspace manifests.

---

## 3. Planned Architecture

The target architecture, as described by `PRODUCT_AND_BUSINESS_RULES.md`, connects the three frontends to a shared backend and a set of external services:

```
Member Mobile ─┐
Admin Web ──────┼──→ Express API ──→ PostgreSQL
Barista Web ────┘
                         │
                         ├── Stripe
                         ├── Email provider
                         ├── Object/file storage
                         └── Authentication providers/services
```

**Every element below the "Express API" box, and the API↔frontend connections themselves, are PLANNED — none are implemented today:**

- Frontend → API connectivity (no frontend currently calls `apps/api`)
- API → PostgreSQL (no database exists)
- Stripe (billing, subscriptions, webhooks)
- Email provider (verification links; vendor not yet named anywhere)
- Object/file storage (café photos, member photos; vendor not yet named anywhere)
- Authentication providers/services (Google OAuth, Apple Sign-In)

`Express API` itself is CONFIRMED as a technology choice (it exists as a skeleton), but its role as the connected hub of this diagram is entirely aspirational at this stage — it currently has no routes, no database connection, and no consumers.

---

## 4. Database

- **PostgreSQL 16 is the currently specified target database.** `PRODUCT_AND_BUSINESS_RULES.md` §9 ("Infrastructure Simplification," 2026-09-08) names it explicitly: *"PostgreSQL 16 row/advisory locks, native scheduling, and client short-polling provide the simplest reliable architecture for Dallas MVP."*
- **The database schema foundation now exists in the repository.** `apps/api/migrations/001_initial_schema.sql` defines the initial PostgreSQL schema and `apps/api/scripts/migrate.mjs` applies it using `DATABASE_URL`.
- **No ORM is used.** The approved implementation uses the raw `pg` client so PostgreSQL row locks and financial transactions remain explicit.
- **The migration runner is intentionally small for Phase 1.** It currently applies the initial idempotent migration; later migrations must be added as numbered files with an applied-migrations ledger before production deployment.

### Additional persistence requirements (architectural requirements, not implemented)

The business specification implies the following persistence needs, none of which have any schema, table, or code representation yet. They are recorded here as requirements for a future schema-design pass, not as existing structures:

- An operational credit-balance table plus an append-only credit ledger, with the invariant that the balance equals the sum of ledger entries (`PRODUCT_AND_BUSINESS_RULES.md` §2.2).
- Redemption tokens with server-authoritative expiry and SHA-256 hash storage (§3.1, §7).
- Immutable financial snapshot fields on redemption records — café name, drink name, retail price, credit cost, payout rate, café payout amount, platform margin — captured at time of scan, never re-derived from live café/drink data (§6.1).
- A café payout batch/adjustment model supporting the one-way `DRAFT → APPROVED → PAID` lifecycle and post-settlement clawback adjustments (§3.3, §5.4).
- A PIN-attempt log keyed on `(ip_address, cafe_id)` supporting lockout derivation (§7).
- A ratings table supporting moderation (hidden ratings excluded from aggregates but retained for audit) (§3.2).

---

## 5. External Integrations

| Integration | Purpose | Status | Owner of source of truth | Notes |
|---|---|---|---|---|
| **Stripe** | Subscription billing, Customer Portal, webhook-driven credit grants | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` §2.2 (`SC-BR-009`), §3, §7 | No `stripe` package, no webhook route, no env var anywhere in the repo |
| **Email delivery** | Email verification link on registration | SPECIFIED (capability); vendor **TBD** | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-002` | Spec never names a vendor; no mail library present in any `package.json` |
| **Google OAuth** | Multi-provider login | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-001` | Mobile `AuthScreen` is an explicit "Demo mode — any email/password combination signs you in" mock |
| **Apple Sign-In** | Multi-provider login | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-001` | Same demo-mode mock as above; no Apple auth package present |
| **Google Places** | Café onboarding address autofill (admin) | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-024` | No Places SDK/API key anywhere; admin-web's Cafés screen has no CRUD form at all currently |
| **Apple/Google Maps** | "Get Directions" deep link from café detail | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-009` | No maps/linking code found in `apps/mobile` |
| **QR scanning (HTML5-QRCode)** | Barista scanner camera viewfinder | SPECIFIED — not integrated | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-019` | Not a dependency of `apps/barista-web`; scanner UI is a static decorative element, not a live camera |
| **Object/file storage** | Café photo gallery, member profile photo | SPECIFIED (capability); vendor **TBD** | `PRODUCT_AND_BUSINESS_RULES.md` `SC-FR-004`, `SC-FR-008` | No storage SDK present; mobile mock uses static placeholder photo fields, not real uploads |

No integration in this table is CONFIRMED. Every one is either a named, specified requirement with zero implementation, or (for email delivery and object storage) a specified capability whose vendor has not even been named in the business spec, let alone implemented.

---

## 6. Security Architecture Status

The following security requirements are **specified by `PRODUCT_AND_BUSINESS_RULES.md` §7 (and related sections) but have no implementation in the repository.** No authentication provider or security library is named below beyond what the business spec itself already names (Argon2id, SHA-256) — none has been selected as an npm package or added as a dependency.

| Requirement | Specified behavior | Source | Implementation status |
|---|---|---|---|
| Authentication | Multi-provider JWT (Email/Password, Google, Apple) | `SC-FR-001` | Not implemented — mobile auth is an explicit no-op demo mock |
| Authorization | Role-based permissions per user role (§1) | `PRODUCT_AND_BUSINESS_RULES.md` §1 | Not implemented — no role/permission enforcement exists in code; the three frontends are separate mock UIs with no shared identity model |
| Password/PIN hashing | Argon2id | §7 | Not implemented — no hashing library present; barista PIN is a hardcoded demo string (`'1234'`) with no hash at all |
| Admin 2FA | Admin JWT + Password / 2FA | §1 (Platform Administrator row) | Not implemented — no 2FA library or flow exists |
| Redemption token hashing | SHA-256 hash stored in DB | §7, §3.1 | Not implemented — no database exists to store hashes; mobile mock token uses a plain in-memory string |
| PIN brute-force protection | `(ip_address, cafe_id)` compound key, >5 failures/15 min → 30-min lockout, reset on success, immutable attempt log | §7 (as synchronized from §9) | Not implemented as a real defense — `apps/barista-web` has a **UI-only demo simulation** of a lockout counter with a manual "reset lockout" demo control; there is no server-side attempt log, no IP tracking, and no real 15/30-minute timers |
| Immutable audit records | Append-only `credit_ledger_entries`; append-only PIN attempt log | §2.2 (`SC-BR-008`), §7 | Not implemented — no database, no ledger table exists |

---

## 7. Runtime Architecture

### Target architecture (planned, not yet implemented)

```
┌────────────────┐   ┌────────────────┐   ┌────────────────┐
│  Member Mobile  │   │   Admin Web     │   │  Barista Web    │
│  (Expo / RN)    │   │  (React + Vite) │   │  (React + Vite) │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                      │
         └──────────────┬──────┴──────────────┬───────┘
                         │   HTTPS / JSON API  │
                         ▼
                ┌───────────────────────┐
                │      Backend API       │
                │    (Express + TS)      │
                └───────────┬────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │    PostgreSQL 16       │
                └───────────┬────────────┘
                            │
        ┌───────────────────┼───────────────────┬────────────────────┐
        ▼                   ▼                    ▼                    ▼
     Stripe            Email Provider     Object/File Storage    Auth Providers
 (billing/webhooks)      (verification)       (photos)          (Google/Apple)
```

### Current repository architecture (what actually exists)

```
apps/mobile (Expo)        apps/admin-web (Vite, :4001)     apps/barista-web (Vite, :4002)
  local React state only     local React state only            local React state only
  no fetch/axios calls       no fetch/axios calls               no fetch/axios calls
        │                          │                                   │
        └────────────── NOT CONNECTED TO ANYTHING ─────────────────────┘

apps/api (Express, PORT env var, default 3000)
        │
        ▼
  GET /health   ← only route that exists
        │
        ▼
  [no database client, no external service calls]
```

**These two diagrams are deliberately kept separate.** The target architecture describes intent recorded in `PRODUCT_AND_BUSINESS_RULES.md`; the current architecture describes only what repository evidence supports today. No line, box, or connection in the target diagram should be treated as existing until it also appears, unqualified, in the current diagram.

---

## 8. Development and Delivery Tooling

| Tool | Role | Evidence |
|---|---|---|
| Node.js / npm | Runtime + package manager, npm workspaces (not pnpm/yarn — no `pnpm-lock.yaml`/`yarn.lock` present) | root `package.json`, `package-lock.json` (`lockfileVersion: 3`) |
| TypeScript | Static typing across all apps | root `tsconfig.json`, each app's `tsconfig.json` |
| ESLint | Linting, flat config with per-app environment globals (node for `apps/api`, browser for the web apps) | `eslint.config.js` |
| Prettier | Formatting (singleQuote, semi, printWidth 100) | `.prettierrc.json`, `.prettierignore` |
| Vitest / Supertest | API test runner and HTTP assertions | `apps/api/package.json`, `apps/api/vitest.config.ts` |
| Git | Version control | repository `.gitignore` |
| GitHub Actions | CI | `.github/workflows/ci.yml` |

**GitHub Actions currently performs CI validation only.** The `validate` job runs: checkout → Node 24 setup → `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build`. **There is no deployment step, no deployment target, and no CD pipeline of any kind.** A green CI run confirms the code builds and passes existing tests/lint — it does not deploy anything, anywhere.

---

## 9. Testing Strategy Status

**CURRENT:**
- `apps/api` has Vitest + Supertest, with one test covering the `/health` route (`apps/api/src/app.test.ts`).
- `apps/mobile`, `apps/admin-web`, and `apps/barista-web` currently have **no configured test framework** — no test script, no test dependency, in any of their `package.json` files.
- **No E2E framework exists** anywhere in the repository (no Playwright, Cypress, Detox, Maestro, or Appium dependency).

**PLANNED / TBD** (no tool has been selected for any of these — none is recorded here as a decision):
- Integration testing (API ↔ database, once a database exists)
- Database testing (schema/constraint verification)
- End-to-end testing (web)
- Mobile end-to-end testing

---

## 10. Infrastructure Status

None of the following has any repository evidence. Each is **TBD** until a decision is recorded here or in a future architecture document:

- Hosting provider
- Managed PostgreSQL provider
- Deployment target
- CDN
- Reverse proxy
- Containerization (no `Dockerfile`/`docker-compose*` exists anywhere in the repo)
- Secrets management (the only environment-variable artifact in the repo is an empty `.env.example` template)
- Monitoring / error tracking
- Analytics
- Production logging (the only logging present is a single `console.log` on API startup, `apps/api/src/server.ts`)

---

## 11. Architectural Principles

These are principles already established by the business specification and the repository's own recorded decisions. Each links to its source rather than restating it in full.

- `PRODUCT_AND_BUSINESS_RULES.md` is authoritative for business behavior; this document does not override or duplicate it.
- Scan-time membership validation is authoritative (token-generation-time checks are advisory/fail-fast only) — `PRODUCT_AND_BUSINESS_RULES.md` §3.1 step 6.
- Financial history must remain auditable — §2.2 (`SC-BR-008`), §6.1.
- Historical financial values must not be silently recomputed from current master data — §6.1 ("Historical reports and statements never join against live `cafes` or `drinks` tables for pricing/name attributes").
- `PAID` payout batches are immutable — §5.4.
- No credit rollover — §2.1 (`SC-BR-002`).
- Voids must preserve accounting/audit history — §3.3 (the two-dimension payout-liability / credit-restoration model).
- Avoid unnecessary infrastructure for Phase 1 — §9 ("Infrastructure Simplification").
- Redis, BullMQ, PostGIS, and WebSockets were explicitly rejected for Phase 1 unless the business specification changes — §9.
- Prefer simple relational transactions and database-enforced invariants where appropriate — §2.2 (`SC-BR-007`, `SC-BR-008`), §9.
- Do not turn implementation assumptions into product requirements — this governs both how this document is maintained (see §14) and how undecided technical items are labeled (TBD, not silently assumed).

---

## 12. Confirmed / Planned / TBD Matrix

| Area | Technology/Decision | Status | Source | Notes |
|---|---|---|---|---|
| Monorepo tooling | npm workspaces | CONFIRMED | root `package.json` | — |
| Runtime | Node.js ≥24 | CONFIRMED | root `package.json` `engines` | — |
| Language | TypeScript ~5.9.3, strict mode | CONFIRMED | root `tsconfig.json` | — |
| Mobile framework | Expo / React Native | CONFIRMED | `apps/mobile/package.json` | — |
| Admin web framework | React 19 + Vite | CONFIRMED | `apps/admin-web/package.json` | — |
| Barista web framework | React 19 + Vite | CONFIRMED | `apps/barista-web/package.json` | — |
| API framework | Express 5 | CONFIRMED | `apps/api/package.json` | Single `/health` route only |
| API testing | Vitest + Supertest | CONFIRMED | `apps/api/package.json` | One test file |
| Linting | ESLint (flat config) | CONFIRMED | `eslint.config.js` | — |
| Formatting | Prettier | CONFIRMED | `.prettierrc.json` | — |
| CI | GitHub Actions | CONFIRMED | `.github/workflows/ci.yml` | Validation only, no deploy |
| Frontend↔API connectivity | HTTP/JSON API calls | PLANNED | §3 target diagram | No frontend currently calls `apps/api` |
| Database engine | PostgreSQL 16 | CONFIRMED foundation | `PRODUCT_AND_BUSINESS_RULES.md` §9, `apps/api/migrations/001_initial_schema.sql` | Local database still needs to be provisioned |
| ORM/query layer | Raw `pg` client | CONFIRMED | `apps/api/src/db.ts` | Explicit transactions and row locks |
| Migration framework | Numbered SQL + Node runner | CONFIRMED foundation | `apps/api/migrations`, `apps/api/scripts/migrate.mjs` | Applied-migration ledger still needed before production |
| Stripe | Billing, webhooks, Customer Portal | SPECIFIED | §2.2, §3, §7 | Not integrated |
| Email delivery | Verification links | SPECIFIED (capability); vendor TBD | `SC-FR-002` | No vendor named in spec or code |
| Google OAuth | Login provider | SPECIFIED | `SC-FR-001` | Not integrated |
| Apple Sign-In | Login provider | SPECIFIED | `SC-FR-001` | Not integrated |
| Google Places | Café address autofill | SPECIFIED | `SC-FR-024` | Not integrated |
| Apple/Google Maps | Directions deep link | SPECIFIED | `SC-FR-009` | Not integrated |
| QR scanning | HTML5-QRCode | SPECIFIED | `SC-FR-019` | Not integrated; scanner is a static mock |
| Object/file storage | Photos (café, member) | SPECIFIED (capability); vendor TBD | `SC-FR-004`, `SC-FR-008` | No vendor named in spec or code |
| Password/PIN hashing | Argon2id | SPECIFIED | §7 | Not implemented |
| Redemption token hashing | SHA-256 | SPECIFIED | §7, §3.1 | Not implemented |
| Admin 2FA | Unspecified 2FA mechanism | SPECIFIED | §1 | Not implemented |
| PIN brute-force protection | `(ip_address, cafe_id)`, 5/15/30 rule, reset-on-success | SPECIFIED | §7 | UI-only demo simulation exists in `apps/barista-web`; not a real defense |
| Immutable audit/ledger records | Append-only ledger + PIN attempt log | SPECIFIED | §2.2, §7 | No database exists |
| Redis | Caching/queues | REJECTED FOR PHASE 1 | `PRODUCT_AND_BUSINESS_RULES.md` §9 | — |
| BullMQ | Background jobs | REJECTED FOR PHASE 1 | §9 | — |
| PostGIS | Geospatial queries | REJECTED FOR PHASE 1 | §9 | Haversine formula specified instead (`SC-FR-006`) |
| WebSockets | Real-time transport | REJECTED FOR PHASE 1 | §9 | Client short-polling specified instead |
| Hosting provider | — | TBD | — | No evidence |
| Managed PostgreSQL provider | — | TBD | — | No evidence |
| Deployment target | — | TBD | — | CI has no deploy step |
| CDN | — | TBD | — | No evidence |
| Reverse proxy | — | TBD | — | No evidence |
| Containerization | — | TBD | — | No `Dockerfile`/`docker-compose*` |
| Secrets management | — | TBD | — | `.env.example` is empty |
| Monitoring/error tracking | — | TBD | — | No evidence |
| Analytics | — | TBD | — | No evidence, not even named in spec |
| Production logging | — | TBD | — | Only a single `console.log` exists |
| Integration testing | — | TBD | — | No database yet to integrate against |
| Database testing | — | TBD | — | No database yet |
| Web E2E testing | — | TBD | — | No framework selected |
| Mobile E2E testing | — | TBD | — | No framework selected |

---

## 13. Relationship to Other Project Documents

```
PRODUCT_AND_BUSINESS_RULES.md
        ↓  WHAT the product must do (business rules, invariants, roles, state machines)

PROJECT_SPECIFICATION.md   (this document)
        ↓  WHAT the system is, WHAT technologies/technical boundaries are established

Future ARCHITECTURE.md
        ↓  HOW the components interact (not created yet)

Future schema/data architecture documentation
        ↓  HOW persistent data is modeled (not created yet)

Code
        implementation
```

`ARCHITECTURE.md` and schema/data-architecture documentation are **not created by this task** and do not exist in the repository yet. When they are created, they should describe *how* the technologies confirmed/planned here actually interact and are structured — this document should not be expanded to cover that ground itself.

---

## 14. Change-Control Rules

- Business-rule changes belong in `PRODUCT_AND_BUSINESS_RULES.md`, not here.
- Technology changes (a dependency added/removed, a new integration wired up, an infrastructure decision made) must update this document (`PROJECT_SPECIFICATION.md`).
- A technology must not be described as **CONFIRMED** merely because it appears in prose (in the business spec, in a comment, or in this document's own "Planned" sections) — CONFIRMED requires actual repository evidence: a dependency, a config file, or working code.
- New external integrations must be documented in §5 and §12 before or at the same time they are introduced into the codebase.
- **PLANNED**/**TBD** decisions must remain clearly labeled as such until a real selection is made and evidenced in the repository — do not silently upgrade a label without corresponding code.
- Historical business decisions recorded in `PRODUCT_AND_BUSINESS_RULES.md` §9 should not be silently rewritten; the same applies to this document — superseding a decision here should say so explicitly rather than deleting the prior text.

---

## 15. Source References

- `PRODUCT_AND_BUSINESS_RULES.md` — business rules, invariants, roles, state machines, decision register
- `package.json` (root) — workspace configuration, shared dev tooling
- `apps/mobile/package.json`, `apps/admin-web/package.json`, `apps/barista-web/package.json`, `apps/api/package.json` — per-app dependencies
- `packages/shared/package.json` — shared package (currently an empty placeholder; see `packages/shared/src/index.ts`)
- `.github/workflows/ci.yml` — CI pipeline definition
- `eslint.config.js`, `.prettierrc.json` — lint/format configuration
- `.env.example` — environment variable template (currently empty)
- `apps/api/src/app.ts`, `apps/api/src/server.ts`, `apps/api/src/app.test.ts` — the entire current API implementation
- `apps/mobile/src/navigation/types.ts` — explicit comment disclaiming a navigation library
- `apps/mobile/src/components/FakeQrCode.tsx` — explicit comment disclaiming a QR-generation dependency

This list points to primary evidence rather than reproducing it — consult the cited files directly for detail beyond what this document states.

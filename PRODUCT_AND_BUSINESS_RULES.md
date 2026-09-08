# Social Cup — Master Product, Business Rules & Behavior Registry

> **Status:** Living Specification & Single Source of Truth  
> **Last Updated:** 2026-09-08  
> **Scope:** Phase 1 Release — Dallas Coffee Network  

This document serves as the authoritative, centralized registry for all **functional requirements, business rules, entity behaviors, system duties, user roles, financial invariants, and state transitions** for Social Cup. Whenever new requirements or design decisions are established, they must be recorded here.

---

## Table of Contents
1. [User Roles & System Duties](#1-user-roles--system-duties)
2. [Core Business Rules & Financial Invariants](#2-core-business-rules--financial-invariants)
3. [Behavioral Specifications & Workflows](#3-behavioral-specifications--workflows)
4. [Functional Requirements Inventory](#4-functional-requirements-inventory)
5. [Domain State Machines & Transitions](#5-domain-state-machines--transitions)
6. [Data Integrity & Snapshotting Policies](#6-data-integrity--snapshotting-policies)
7. [Security & Credential Rules](#7-security--credential-rules)
8. [Edge Case & Failure-Mode Rules](#8-edge-case--failure-mode-rules)
9. [Decision Register & Changelog](#9-decision-register--changelog)

---

## 1. User Roles & System Duties

| Role | Interface Surface | Authentication | Permissions & System Duties |
| :--- | :--- | :--- | :--- |
| **Anonymous User** | Mobile App (iOS / Android) | None | • Browse cafes and drink menus.<br>• Search cafes by name and filter by neighbourhood.<br>• View community star ratings.<br>• *Restricted:* Cannot rate drinks, cannot generate redemption codes. |
| **Registered Visitor** | Mobile App (iOS / Android) | JWT (Email, Google, Apple) | • All Anonymous permissions.<br>• Save onboarding preferences (coffee types, home neighbourhood).<br>• Rate drinks (1–5 stars + 140-char note) and build personal Drink Diary.<br>• *Restricted:* Cannot redeem drinks; tapping "Redeem here" opens the Stripe subscription paywall. |
| **Active Member** | Mobile App (iOS / Android) | JWT (Email, Google, Apple) | • All Visitor permissions.<br>• Holds active monthly subscription ($24.99/mo).<br>• Holds 1–30 drink credits.<br>• Generates single-use, 5-minute counter redemption QR / 6-digit codes.<br>• Accesses Stripe Customer Portal for billing management. |
| **Partner Barista** | Mobile Web Scanner (No App / No Account) | Cafe PIN $\rightarrow$ Trusted Device Cookie | • Opens private mobile web link on shop phone/tablet.<br>• Enters 4-digit cafe PIN once to trust device.<br>• Scans member QR codes or enters 6-digit backup code.<br>• Receives instant Green (valid) or Red (error reason) feedback.<br>• Views "Today" shift log of processed redemptions.<br>• *Restricted:* Cannot view financial reports, member billing data, or edit menus. |
| **Platform Administrator** | Web Admin Panel (Desktop React SPA) | Admin JWT + Password / 2FA | • Onboard/edit cafes, coordinates, opening hours, vibe tags, photos.<br>• Set/reset cafe PINs (instantly invalidates trusted barista devices).<br>• Configure cafe payout rate per credit ($\$$/credit).<br>• Manage drink menus, retail prices, and integer credit prices.<br>• Use Live Margin Calculator during drink pricing.<br>• Audit redemption logs, execute voids with logged reasons.<br>• Compile monthly payout batches, export CSV statements, record bank wires. |

---

## 2. Core Business Rules & Financial Invariants

### 2.1 Subscription & Pricing Rules
* **`SC-BR-001` (Plan Price):** Social Cup offers exactly one subscription tier priced at **$24.99/month**.
* **`SC-BR-002` (Credit Allocation & No Rollover):** Every successful billing renewal grants exactly **30 drink credits**. Unused credits expire at the end of the billing cycle. **Credits do NOT roll over** (`Rollover = 0`).
* **`SC-BR-003` (No Top-Ups in Phase 1):** Members cannot purchase ad-hoc credits or top-up packs mid-month.
* **`SC-BR-004` (Integer Drink Pricing):** Drink credit costs are strictly **positive integers** ($\ge 1$, e.g., 3, 4, 5 credits). No fractional/decimal credits are allowed.
* **`SC-BR-005` (Custom Cafe Payout Rates):** Each partner cafe has an independently negotiated payout rate in dollars per credit (e.g., $0.85/credit), set by the Administrator.
* **`SC-BR-006` (Single-Use, Zero Pre-Deduction):** Generating a redemption code **NEVER** deducts credits from a member’s balance. Credits are deducted **ONLY** at the exact instant the barista successfully scans the code at the counter.

### 2.2 Credit Ledger Invariants
* **`SC-BR-007` (Non-Negative Balance Invariant):** A member's credit balance must never fall below zero (`current_balance >= 0`). Database check constraints strictly enforce this invariant.
* **`SC-BR-008` (Authoritative Operational vs. Historical Ledger):**
  * The operational source of truth is `user_credit_balances.current_balance`, locked with `SELECT ... FOR UPDATE` during write transactions.
  * The historical audit authority is the append-only `credit_ledger_entries` table.
  * Invariant: `user_credit_balances.current_balance` $\equiv \sum \text{credit\_ledger\_entries.amount}$.
* **`SC-BR-009` (Webhook-Driven Resets):** Balance resets and grants are driven strictly by verified Stripe webhooks (`invoice.payment_succeeded`). Cron jobs must never independently mutate balances.

---

## 3. Behavioral Specifications & Workflows

### 3.1 Counter Redemption & Barista Scan Workflow
1. **Initiation:** Member opens cafe page at counter, taps "Redeem here", selects a drink, and sees the credit cost and post-redemption balance.
2. **Token Generation:** On confirmation, the backend generates a cryptographically random token hashed with SHA-256 in the database.
   * A 6-digit alphanumeric backup code (e.g., `K9B2A7`) is generated and bound to `cafe_id`.
   * Validity duration is **strictly 300 seconds (5 minutes)**. Server UTC time is the sole authority.
   * A member may hold **only one active pending token** at a time. Generating a new code cancels the previous one.
3. **Counter Presentation:** The mobile screen displays the QR code at maximum brightness with an animated 5-minute countdown.
4. **Member Polling:** While the redemption modal is open, the mobile app polls `GET /api/v1/redemptions/active` every 1.5 seconds.
5. **Barista Scan:** Barista scans the QR code with their mobile web scanner (or types the 6-digit backup code).
6. **Server Atomic Verification (<3 Seconds):**
   * Server locks the token row: `SELECT * FROM redemption_tokens WHERE token_hash = $1 FOR UPDATE`.
   * Checks: Token is `PENDING`, `NOW() <= expires_at`, `token.cafe_id == barista.cafe_id`.
   * Server locks user balance: `SELECT current_balance FROM user_credit_balances WHERE user_id = $1 FOR UPDATE`.
   * Asserts: `current_balance >= token.credit_cost`.
   * Deducts balance, records `credit_ledger_entries` (`DEDUCT_REDEMPTION`), marks token `REDEEMED`, and creates `redemptions` record with immutable financial snapshots.
7. **Scanner UI Feedback:**
   * **Success (Green Screen):** Displays member's first name, photo, drink name, and credits deducted. Auto-dismisses back to camera after 5 seconds.
   * **Failure (Red Screen):** Displays a single explicit error reason: `EXPIRED`, `ALREADY_USED`, `MEMBERSHIP_INACTIVE`, `NOT_ENOUGH_CREDITS`, `WRONG_CAFE`, or `NO_CONNECTION`.
8. **Member App Flip:** Mobile short-polling detects `REDEEMED` status within $\le 2$ seconds. Screen flips to green confirmation, then presents the prompt to rate the drink.

### 3.2 Drink Ratings & Diary Behavioral Rules
* A user can submit a rating of **1 to 5 stars** with an optional **$\le 140$-character note**.
* **One rating per user per drink:** Subsequent submissions overwrite the existing rating.
* **Verified Redemption Flag:** Ratings submitted post-redemption are flagged `verified_redemption = TRUE`. Unredeemed visitor reviews are flagged `verified_redemption = FALSE`.
* **Cafe Aggregate Score:** A cafe’s star rating is the arithmetic mean of all ratings across all drinks it serves. If zero drinks have ratings, a "New" badge renders.
* **Personal Drink Diary:** The member profile displays a personal log of all rated drinks, ordered strictly by `stars DESC, created_at DESC`.

### 3.3 Voiding & Settlement Accounting Workflow
* **Voiding Pre-Statement:** If an admin voids a redemption before monthly statements are compiled, the redemption is marked `VOIDED`, credits are restored to the member, and accrued cafe payout liability is reduced.
* **Voiding Post-Settlement (Batch Paid):** If a redemption is voided after bank wires have been transferred:
  * The historical paid statement remains untouched and immutable.
  * A negative adjustment is inserted into `cafe_payout_adjustments`.
  * The adjustment is automatically subtracted as a clawback line item from the cafe’s **next month's payout statement**.
  * Credits are restored to the member as an off-cycle ledger entry (`RESTORE_VOID`).

---

## 4. Functional Requirements Inventory

| ID | Module | Description | Validation / Rule |
| :--- | :--- | :--- | :--- |
| **`SC-FR-001`** | Auth | Multi-provider login (Email/Password, Google OAuth, Apple Sign-In). | Passwords min 8 chars with upper, lower, number. |
| **`SC-FR-002`** | Auth | Email verification link dispatched on registration. | Blocks rating or subscribing until verified. |
| **`SC-FR-003`** | Auth | Password reset links expire after exactly 60 minutes. | Single-use signed token. |
| **`SC-FR-004`** | Profile | Onboarding collects display name, photo (optional), coffee preferences, and Dallas neighbourhood. | Preferences: matcha, espresso, cold brew, latte. |
| **`SC-FR-005`** | Discovery | One-time device location permission request for distance sorting. | Falls back to neighbourhood sorting if denied. |
| **`SC-FR-006`** | Discovery | Discover feed displays: (1) Featured cafes strip, (2) Signature drinks strip, (3) Distance-ordered list. | Distance computed via spherical Haversine formula. |
| **`SC-FR-007`** | Discovery | Real-time name search and Dallas neighbourhood filtering. | Default filter = user's saved neighbourhood. |
| **`SC-FR-008`** | Cafe Detail | Cafe detail screen shows gallery (up to 5 photos), address, hours, vibe tags, directions, menu, "Redeem". | Displays "Open Now" dynamic indicator. |
| **`SC-FR-009`** | Navigation| "Get Directions" opens Apple Maps (iOS) or Google Maps (Android). | Uses cafe latitude/longitude coordinates. |
| **`SC-FR-010`** | Ratings | 1–5 star rating and optional $\le 140$-character note per drink. | Text sanitized against HTML/script injection. |
| **`SC-FR-011`** | Ratings | One rating per user per drink (upsert semantics). | Database unique constraint `(user_id, drink_id)`. |
| **`SC-FR-012`** | Diary | Personal Drink Diary screen sorted highest rated first. | Displays drink, cafe, stars, note, and date. |
| **`SC-FR-013`** | Ratings | Cafe rating dynamically reflects average of its drinks' ratings. | Shows "New" badge when 0 drinks rated. |
| **`SC-FR-014`** | Billing | Stripe Native Payment Sheet embedded in mobile app ($24.99/mo). | Supports Apple Pay, Google Pay, and Cards. |
| **`SC-FR-015`** | Ledger | Webhook grants 30 credits and activates Member status immediately. | Idempotent on Stripe invoice ID. |
| **`SC-FR-016`** | Billing | Stripe Customer Portal link inside app for payment updates/cancel. | Web link generated via backend session API. |
| **`SC-FR-017`** | Redeem | 5-minute single-use QR code and 6-digit backup code generated. | Server UTC timestamp enforced; expires at T+300s. |
| **`SC-FR-018`** | Redeem | Only one live pending redemption token permitted per user. | Generating a new token cancels previous pending token. |
| **`SC-FR-019`** | Barista | Lightweight mobile web scanner page with zero app install / no account.| Camera viewfinder opens on page load via HTML5-QRCode. |
| **`SC-FR-020`** | Barista | Cafe PIN entry trusts device session via HTTP-only cookie. | Invalidation tied to `cafe.pin_version`. |
| **`SC-FR-021`** | Barista | Counter redemption verified and credits deducted in $\le 3$ seconds. | Atomic row-locked PostgreSQL transaction. |
| **`SC-FR-022`** | Barista | Instant full-screen Green (valid) or Red (single failure reason). | Explicit error reasons defined. |
| **`SC-FR-023`** | Barista | "Today" shift tab displays redemptions for current calendar day. | Filtered by `cafe_id` and UTC today. |
| **`SC-FR-024`** | Admin | Full CRUD on cafes, coordinates, payout rates, and PIN resets. | Google Places autofill integration in modal. |
| **`SC-FR-025`** | Admin | Full CRUD on cafe drink menus with retail and credit prices. | Toggle active/inactive without deleting. |
| **`SC-FR-026`** | Admin | Live Pricing Calculator shows margin ($ and %) as prices are typed. | Computes member savings and net platform margin. |
| **`SC-FR-027`** | Admin | System-wide redemption audit log with filters, CSV export, and void. | Every void requires admin ID and text reason. |
| **`SC-FR-028`** | Admin | Monthly cafe payout batch generation, CSV export, bank wire logging. | Tracks draft, approved, and paid batch states. |
| **`SC-FR-029`** | Privacy | In-app account deletion cancels Stripe and anonymizes user records. | Preserves financial audit and redemption history. |

---

## 5. Domain State Machines & Transitions

### 5.1 User Account Lifecycle
$$\text{REGISTERED} \xrightarrow{\text{Email Verified / OAuth}} \text{ACTIVE} \underset{\text{Admin Re-enable}}{\overset{\text{Admin Ban}}{\rightleftharpoons}} \text{SUSPENDED} \xrightarrow{\text{In-App Delete}} \text{DELETED}$$

### 5.2 Subscription Billing Lifecycle
$$\text{NONE} \xrightarrow{\text{First Payment Succeeded}} \text{ACTIVE} \underset{\text{Payment Recovered}}{\overset{\text{Payment Failed}}{\rightleftharpoons}} \text{PAST\_DUE} \xrightarrow{\text{Smart Retries Exhausted}} \text{UNPAID}$$
$$\text{ACTIVE} \xrightarrow{\text{Cancel Requested}} \text{CANCELING (Grace Period)} \xrightarrow{\text{Period End}} \text{CANCELED}$$
$$\text{ANY} \xrightarrow{\text{Immediate Cancel / Delete}} \text{CANCELED}$$

### 5.3 Redemption Token Lifecycle
$$\text{PENDING (300s)} \xrightarrow{\text{Barista Scans (Valid)}} \text{REDEEMED}$$
$$\text{PENDING} \xrightarrow{300\text{s Elapses}} \text{EXPIRED}$$
$$\text{PENDING} \xrightarrow{\text{User Generates New Code}} \text{SUPERSEDED}$$

### 5.4 Financial Payout Batch Lifecycle
$$\text{DRAFT (Accruing)} \xrightarrow{\text{Admin Audits}} \text{APPROVED} \xrightarrow{\text{Bank Wire Recorded}} \text{PAID}$$

---

## 6. Data Integrity & Snapshotting Policies

### 6.1 Strict Financial Snapshots
When a redemption occurs, the following fields are **immutably snapshotted** directly onto the `redemptions` row:
1. `cafe_name_snapshot`: Preserves cafe trading name at time of scan.
2. `drink_name_snapshot`: Preserves drink title at time of scan.
3. `retail_price_snapshot`: Retail price ($) at time of scan.
4. `credit_cost_snapshot`: Credits deducted at time of scan.
5. `payout_rate_snapshot`: Agreed cafe payout rate ($\$$/credit) at time of scan.
6. `cafe_payout_amount`: $\text{credits} \times \text{payout\_rate}$.
7. `platform_margin_amount`: $\text{retail\_price} - \text{cafe\_payout\_amount}$.

*Policy:* Historical reports and statements **never** join against live `cafes` or `drinks` tables for pricing/name attributes.

---

## 7. Security & Credential Rules

* **Zero Plaintext Secrets:** Passwords and cafe PINs are hashed using **Argon2id**.
* **Tokens Hashed in DB:** Refresh tokens, barista device sessions, and redemption QR codes are stored exclusively as **SHA-256 hashes**.
* **Backup Code Salted Hash:** 6-digit backup codes are stored as `SHA-256(cafe_id || ":" || backup_code)`.
* **PIN Brute-Force Defense:** More than 5 failed PIN attempts from an IP/cafe within 15 minutes triggers an automatic 30-minute lockout.
* **Instant Session Revocation:** When an Admin resets a cafe's PIN, `cafes.pin_version` increments by 1. All active barista device tokens matching older versions are immediately rejected with HTTP 401.
* **Stripe Webhook Defense:** Strict raw body HMAC-SHA256 signature verification (`stripe.webhooks.constructEvent`) with dedicated webhook secret and event deduplication table.

---

## 8. Edge Case & Failure-Mode Rules

1. **Replay & Concurrency:** Multiple baristas scanning the same QR code simultaneously are serialized via PostgreSQL `SELECT ... FOR UPDATE`. Exactly one transaction claims the token; the others receive `ALREADY_USED`.
2. **Device Clock Desync:** Token validity is verified strictly against server `NOW()`. Client device clocks are ignored.
3. **Network Drops Mid-Scan:** Barista scan submission is idempotent using a client-generated UUID `idempotency_key`. Retrying a dropped connection returns the cached green confirmation.
4. **Offline In-Store Member:** Once the QR code is generated, the member’s phone does NOT require an active internet connection. The barista's device (on shop Wi-Fi) communicates with the backend.
5. **Account Deletion with Active Subscription:** Immediately cancels Stripe recurring billing, scrubs PII, and sets status to `DELETED`. Completed redemptions remain linked to the anonymized record for tax and payout accounting.

---

## 9. Decision Register & Changelog

| Date | Item | Decision / Status | Rationale |
| :--- | :--- | :--- | :--- |
| **2026-09-08** | Infrastructure Simplification | **APPROVED (Phase 1):** Removed Redis, BullMQ, PostGIS, and WebSockets. | PostgreSQL 16 row/advisory locks, native scheduling, and client short-polling provide the simplest reliable architecture for Dallas MVP. |
| **2026-09-08** | Expiry Grace Period | **REJECTED (15s Grace):** Token strictly expires at exactly 300 seconds. | Adheres strictly to PDC and prevents member confusion at counter. |
| **2026-09-08** | Identity Architecture | **APPROVED:** Split `users` and `user_identities`. | Enables multi-provider OAuth, Apple Relay, and credential linking without domain corruption. |
| **2026-09-08** | Webhook Idempotency | **APPROVED:** Unique constraint on `credit_ledger_entries.idempotency_key`. | Prevents duplicate credit grants from webhook retries. |
| **2026-09-08** | Post-Settlement Voids | **APPROVED:** Carryover clawback via `cafe_payout_adjustments`. | Protects audited historical statements while recovering funds on next month's invoice. |

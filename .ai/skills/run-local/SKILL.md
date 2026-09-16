---
name: run-local
description: Start and validate all Social Cup applications for local review without changing repository or environment state.
---

# /run-local

## Purpose

Start the API and all user-facing web applications independently, validate
their readiness, and report a clear local-only status. This workflow never
deploys anything.

## When to use

Use for local review when changes span, or may affect, the API, member mobile
web, admin web, or barista web applications.

## Prerequisites

- Run from the repository root.
- Node 24, npm, and installed workspace dependencies must be available.
- Check `git status --short` before starting.
- Do not run `npm ci` automatically. Stop and request approval if dependencies
  are missing.

## Applications and startup order

Start each application as an independent process in this order:

1. API — `npm run dev --workspace=@social-cup/api` — port `3000`
2. Mobile — `npm run web --workspace=@social-cup/mobile` — port `4000`
3. Admin — `npm run dev --workspace=@social-cup/admin-web` — port `4002`
4. Barista — `npm run dev --workspace=@social-cup/barista-web` — port `4001`

The Vite applications use their checked-in `vite.config.ts` ports. Do not
override them casually.

## Port and process safety

- Check each expected port before starting.
- If the port already serves the expected Social Cup application, reuse it and
  mark it as already running.
- If a port is occupied by an unknown process, report the process identity and
  stop for approval. Never kill it automatically.
- Never use broad process termination such as `taskkill /F /IM node.exe`.
- Start new applications independently and retain their process identities.
- Do not wait indefinitely; use bounded startup and health-check timeouts.
- On shutdown, stop only processes started by this workflow.

## Validation

Check:

- API: `GET http://localhost:3000/health` must return HTTP 200 and JSON with
  `status` equal to `ok`.
- Mobile: `http://localhost:4000`
- Barista: `http://localhost:4001`
- Admin: `http://localhost:4002`

Verify dependencies before startup by checking the root `node_modules` and the
workspace manifests. Do not modify `.env` files or database configuration.

## Failure handling

If startup or validation fails, inspect the actual process output and report
the failing application, command, port, and log location. Do not repeatedly
restart a failing process. Leave pre-existing processes untouched.

## Prohibited actions

This workflow must not:

- modify Git state, commit, push, branch, reset, or clean;
- run migrations or seed the database;
- create permanent accounts or test data;
- perform Vercel, Render, or other deployment actions;
- imply that local startup is deployment;
- change dependencies or application source code.

## Final status format

```text
Local Environment Status

API        : RUNNING / FAILED / REUSED
Mobile     : RUNNING / FAILED / REUSED
Admin      : RUNNING / FAILED / REUSED
Barista    : RUNNING / FAILED / REUSED

API Health : PASS / FAIL
Git Status : CLEAN / CHANGED

Deployment : NOT PERFORMED (local only)
```

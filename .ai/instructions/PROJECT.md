# Social Cup project

Social Cup is a Dallas coffee discovery, membership, credits, redemption, and
café management platform.

## Repository structure

```text
apps/
  mobile/       Member-facing Expo application and mobile web build
  admin-web/    Administrator React/Vite application
  barista-web/  Barista React/Vite scanner application
  api/          Express API

packages/
  shared/       Framework-agnostic contracts, enums, schemas, and types
```

The root `package.json` uses npm workspaces for `apps/*` and `packages/*`.
Node 24 and npm are the repository toolchain.

## Authoritative documentation

- `PROJECT_SPECIFICATION.md` describes confirmed current implementation and
  planned boundaries.
- `ARCHITECTURE.md` describes the approved target architecture.
- `PRODUCT_AND_BUSINESS_RULES.md` defines product and financial behavior.
- `DATABASE_SCHEMA.md` defines the database foundation.

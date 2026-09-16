# Social Cup architecture guidance

The repository contains four application surfaces and one shared package:

- `apps/mobile` is the member-facing Expo application. It supports native
  Android/iOS and a React Native Web build.
- `apps/admin-web` is the administrator React/Vite SPA.
- `apps/barista-web` is the barista React/Vite scanner SPA.
- `apps/api` is the Express API and the only owner of server-side business
  rules.
- `packages/shared` contains framework-agnostic contracts and types.

Frontends must not access PostgreSQL or third-party secret APIs directly.
The intended integration boundary is HTTPS JSON through the API. The current
prototype state and confirmed routes are documented in
`PROJECT_SPECIFICATION.md`; do not assume target architecture features are
already implemented.

The API exposes `GET /health` for local readiness checks. Its development
workspace command is `npm run dev --workspace=@social-cup/api`.

Application-specific runtime and security details remain in
`ARCHITECTURE.md`, `PRODUCT_AND_BUSINESS_RULES.md`, and
`DATABASE_SCHEMA.md`. Update those authoritative documents when architectural
facts change; do not create competing copies here.

# Social Cup development rules

## Change discipline

- Confirm the request and inspect existing patterns before editing.
- Prefer surgical, behavior-preserving changes.
- Do not redesign UI, refactor unrelated code, or change public contracts
  without an explicit requirement.
- Reuse existing helpers, styles, types, and workspace conventions.
- Do not add dependencies or tooling unless the task requires it.

## Validation

Run the smallest relevant existing checks, then inspect `git diff` and
`git diff --check`. For workspace changes, use the package's existing
`lint`, `typecheck`, `test`, or `build` scripts. Report failures plainly.

## Local services

Local review uses these applications and ports:

| Service | Workspace | Command | URL |
|---|---|---|---|
| API | `@social-cup/api` | `npm run dev --workspace=@social-cup/api` | `http://localhost:3000` |
| Mobile | `@social-cup/mobile` | `npm run web --workspace=@social-cup/mobile` | `http://localhost:4000` |
| Barista | `@social-cup/barista-web` | `npm run dev --workspace=@social-cup/barista-web` | `http://localhost:4001` |
| Admin | `@social-cup/admin-web` | `npm run dev --workspace=@social-cup/admin-web` | `http://localhost:4002` |

Do not run migrations, seed data, deployments, or broad workspace dev commands
as part of a normal local review.

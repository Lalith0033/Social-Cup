# Social Cup agent instructions

## Repository baseline

Social Cup is an npm-workspaces monorepo for a coffee discovery and membership
platform. Read the canonical project knowledge in `.ai/instructions/` before
making changes:

- `.ai/instructions/PROJECT.md`
- `.ai/instructions/ARCHITECTURE.md`
- `.ai/instructions/DEVELOPMENT-RULES.md`

The detailed product, architecture, and database documents at the repository
root remain authoritative for their respective domains.

## Working rules

- Investigate the relevant code and documentation before implementing.
- Make the smallest complete change that satisfies the request.
- Do not refactor unrelated code or change behavior, APIs, schemas, or
  deployment configuration unless explicitly requested.
- Preserve the existing Expo, React, Vite, Express, and npm-workspaces
  architecture.
- Validate changes with the smallest relevant existing checks.
- Keep temporary files, logs, and test data outside the repository when
  possible, and clean up temporary artifacts you create.
- Never claim that a service is deployed when it was only started locally.
- Do not create permanent test accounts or permanent test data.

## Git and environment safety

- Check `git status --short` before and after work.
- Do not commit, push, create branches, reset, clean, or rewrite history unless
  explicitly requested.
- Do not use destructive Git commands.
- Do not modify `.env` files, database configuration, or run migrations/seeds
  unless explicitly requested.
- Do not terminate broad process groups. Identify a process before stopping it.
- Ask before terminating an unknown process that occupies a required port.

## Local workflows

Reusable workflows are canonical under `.ai/skills/`. Use
`.ai/skills/run-local/SKILL.md` for the `/run-local` local review workflow.

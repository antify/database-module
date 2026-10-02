# AGENTS.md

Guidance for coding agents (and humans) working in this repository.

## Purpose

`@antify/database-module` is a Nuxt module that wraps `@antify/database` (multi-tenancy MongoDB layer). It registers the Nitro aliases `#database-module` and `#database-module-config`, exposes `useDatabaseClient(databaseId, tenantId | null, ...)` for server code and closes connections on shutdown. It is published to npm.

## Prerequisites

- Node `^22.14.0` (`.nvmrc` and CI use `22.14.0`; newer Node only prints an engine warning).
- pnpm `10.10.0` (see `packageManager`; `corepack enable` picks it up).
- Docker, only for the playground: it needs a MongoDB (`docker-compose.yml`, image `mongodb/mongodb-atlas-local`, port 27017, no auth).

## Commands

Timings measured on a fast dev machine (2026-10-02).

| Command | Purpose | Time |
| --- | --- | --- |
| `CI=true pnpm install --frozen-lockfile` | Install (non-interactive, as in CI) | ~2-5 s |
| `pnpm dev:prepare` | Stub build + generate playground types; run this before lint/IDE work | ~4 s |
| `pnpm prepack` | Real build to `dist/` (runs `dev:prepare` first); there is no separate `build` script | ~8 s |
| `pnpm lint` | ESLint (flat config), no auto-fix | ~2 s |
| `pnpm lint:fix` | ESLint with `--fix` | ~2 s |
| `pnpm dev:build` | Build the playground app | ~8 s |
| `pnpm dev` | Playground dev server on http://localhost:3000, ready after ~25 s; needs MongoDB | - |

Fastest check after a change: `pnpm dev:prepare && pnpm lint` (~6 s); before pushing add `pnpm prepack`.

Do NOT run `pnpm release` (see "Releases"). `docker compose up -d` also starts a `mailhog` container that nothing in this repo uses.

### Trying the playground

```sh
cp .env.example .env
docker compose up -d
pnpm dev
curl -X POST 'http://localhost:3000/api/migrate?databaseId=core'
```

Playground routes live in `playground/server/api/` (`migrate`, `load-fixtures`, `test`, all `POST`). `migrate` runs the migrations from `migrations/{core,tenant}/` against the database named by `databaseId`.

## Environment variables (playground)

Read in `database.config.ts` via `dotenv` from `.env`:

- `NUXT_DB_CORE_URL` (default `mongodb://localhost:27017/core?directConnection=true`)
- `NUXT_DB_TENANT_URL` (default `mongodb://localhost:27017/?directConnection=true`)

`.env.example` contains local example values only.

## Repository map

- `src/module.ts` - `defineNuxtModule` (config key `databaseModule`, option `configPath`, default `./database.config.ts`), aliases, runtime config, type template, connection cleanup.
- `src/runtime/server/` - runtime code: `database.ts` (`useDatabaseClient`), `errors/`, `index.ts`.
- `playground/` - Nuxt app (`ssr: false`, auto-imports off: import explicitly from `#imports` / `#database-module`). It is the only test environment.
- `database.config.ts` and `migrations/` - database configuration and migrations used by the playground.
- `docker-compose.yml`, `docker/` - local MongoDB.
- `eslint.config.js` - lint config (tabs in most files, single quotes).

## How the three repositories fit together

`database` <- `database-cli` <- `database-module`

- `@antify/database`: core (Mongoose clients, migrations, fixtures). No CLI, no Nuxt.
- `@antify/database-cli`: the `db` binary, a thin wrapper around the core.
- `@antify/database-module` (this repo): depends on `@antify/database` (dependency) and `@antify/database-cli` (devDependency), both with exact versions in `package.json`, resolved from the npm registry. There is no local linking.
- Release order: publish `database`, then bump its pin in `database-cli` and publish, then bump both pins here and publish. A pin can only be raised after the previous package is on npm, otherwise `pnpm install` fails.

## Commits and releases

- Conventional Commits (`feat:`, `fix:`, `chore:`, `feat!:` for breaking). `standard-version` derives the version and changelog from them.
- **Merging to `main` publishes a new npm release automatically** (`.github/workflows/release.yml` runs `pnpm release`: version bump, tag, push, `pnpm publish`). Treat every merge as a release. Never run `pnpm release` or `pnpm publish` locally.
- Pull requests run install, `pnpm prepack` and `pnpm lint` (`.github/workflows/pr.yml`).

## Current state

- There are no automated tests (as of 2026-10-02). Verification is lint, build and the playground.
- Lint is clean today: do not introduce new lint errors.

## Safety

- Run the playground and migrations only against a local throwaway MongoDB (the compose container). Never point `NUXT_DB_CORE_URL` / `NUXT_DB_TENANT_URL` at a shared or production database: the playground runs migrations and fixtures against whatever they name.
- `docker compose down -v` removes the local container and its data.

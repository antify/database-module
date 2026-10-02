# Database module

This module provides a simple interface to interact with a multi-tenancy MongoDB database.

# Development

- Run `CI=true pnpm install --frozen-lockfile` to install (pnpm 10, Node 22).
- Run `pnpm run dev:prepare` to generate type stubs.
- Run `docker compose up -d` and copy `.env.example` to `.env` to get a local throwaway MongoDB for the playground.
- Use `pnpm run dev` to start [playground](playground) in development mode.
- Run `pnpm prepack` to build and `pnpm lint` to lint.

Never point the playground at a shared or production database. See [AGENTS.md](AGENTS.md) for commands, repository layout, and release notes (merging to `main` publishes to npm).

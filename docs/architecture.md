# Architecture

`ragebait` is an npm-workspace monorepo with `apps/web` (React, TypeScript, Vite) and `apps/api` (Express, TypeScript). Both use strict TypeScript. The web app has app bootstrap/routing, shared layout/components/services, then feature-owned code. The API composes routes at `src/routes`, handles cross-cutting concerns in `middleware`, validates runtime configuration in `config`, and keeps domain behavior in `features`.

The public API prefix is `/api`; health is `GET /api/health` at `http://localhost:9001/api/health`. Successful API payloads use `{ "data": ... }`; failures use `{ "error": { "code", "message" } }`. No database, authentication, AI integration or third-party service is included.

Ports are invariant: Vite dev/preview and Nginx listen on `9000`; Express listens on `9001`. Vite proxies browser `/api` to `http://localhost:9001`; Compose Nginx proxies `/api` to `backend:9001`. The browser bundle only uses `/api`, never Docker DNS.

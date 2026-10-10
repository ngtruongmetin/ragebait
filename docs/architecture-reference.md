# EDP reference analysis

Reviewed locally from `https://github.com/ngtruongmetin/edp`, branch `feat/ai`, on 2026-10-09. No files in that repository were changed.

EDP has separate `frontend` and `backend` packages. Frontend uses React 19, TypeScript, Vite 7, React Router 7, Axios, Tailwind/PostCSS and ESLint flat config. `src/main.tsx` bootstraps providers; `App.tsx` owns route composition; a shared Axios client uses `/api`. Backend is Node/Express 5 in CommonJS JavaScript with PostgreSQL (`pg`), sessions and AJV validation. It groups backend code by domain under `backend/modules/<feature>`; representative AI modules use `routes.js`, `service.js`, validation/schema and repository/config helpers. Docker Compose supplies Postgres, backend and an Nginx-served frontend which proxies `/api`.

Conventions retained by ragebait: separated client/server, React entry and route composition, a shared API boundary, backend modules grouped by feature, explicit configuration, schema validation and container proxying. Not retained: EDP's PostgreSQL/session/auth/AI/PWA/Tailwind dependencies, because the requested foundation has no need for them. Ragebait upgrades the baseline to strict TypeScript, root workspaces, centralized error responses and runnable tests.

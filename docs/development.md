# Development guide

Create a feature only when it has a clear user-facing responsibility. In `apps/web/src/features/<feature>`, keep its UI, hooks, types and feature service together. Use `services/apiClient.ts` for HTTP rather than invoking `fetch` from components. Validate untrusted API data with Zod, and provide loading, empty and error states for data UI.

On the API, add `features/<feature>/schema.ts` for boundary contracts, `service.ts` for business logic and `routes.ts` for HTTP mapping. Mount it from `routes/index.ts`. Return the standard success/error envelope and let unexpected failures reach `middleware/errorHandler.ts`; never expose stack traces. Add focused Vitest coverage for important service behavior and boundary validation.

The existing status feature demonstrates the complete small path: `HealthStatusCard` -> `statusService` -> shared API client -> `GET /api/health` -> health route -> service -> schema-shaped response -> service test.

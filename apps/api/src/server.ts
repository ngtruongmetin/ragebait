import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, env.HOST, () =>
  console.info(`ragebait API listening on http://${env.HOST}:${env.PORT}/api`),
);
function shutdown(signal: string) {
  console.info(`${signal} received; stopping API.`);
  server.close(() => process.exit(0));
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

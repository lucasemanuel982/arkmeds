import "dotenv/config";
import { createApp } from "./infrastructure/http/app";
import { env } from "./infrastructure/config/env";
import { logger } from "./shared/logger";

const app = createApp();
const server = app.listen(env.port, env.host, () => {
  logger.info(`Servidor rodando em http://${env.host}:${env.port}`);
});

const shutdown = (): void => {
  server.close(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

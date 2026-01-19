import { createApp } from "./infrastructure/http/app";
import { env } from "./infrastructure/config/env";

const app = createApp();
const server = app.listen(env.port, env.host, () => {
  console.log(`Servidor rodando em http://${env.host}:${env.port}`);
});

const shutdown = (): void => {
  server.close(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

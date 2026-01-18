import { createApp } from "./infrastructure/http/app";
import { env } from "./infrastructure/config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});

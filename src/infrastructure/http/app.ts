import express from "express";
import { routes } from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

function createApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use(routes);
  app.use(errorMiddleware);
  return app;
}

export { createApp };

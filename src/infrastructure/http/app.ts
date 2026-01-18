import express from "express";
import { routes } from "./routes";

function createApp(): express.Express {
  const app = express();
  app.use(express.json());
  app.use(routes);
  return app;
}

export { createApp };

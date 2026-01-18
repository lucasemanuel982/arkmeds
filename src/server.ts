import express from "express";
import { env } from "./config/env";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(env.port, () => {
  console.log(`Servidor rodando na porta ${env.port}`);
});


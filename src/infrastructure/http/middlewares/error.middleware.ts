import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { logger } from "../../../shared/logger";

interface PgError extends Error {
  code?: string;
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  const pg = err as PgError;
  if (pg.code === "23505") {
    res.status(409).json({ error: "CPF já cadastrado" });
    return;
  }
  logger.error({ err }, "Erro interno do servidor");
  res.status(500).json({ error: "Erro interno do servidor" });
}

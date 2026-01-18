import { Request, Response, NextFunction } from "express";

const requiredCreate = ["nome", "cpf", "dataNascimento", "sexo", "endereco"] as const;
const requiredEndereco = ["rua", "numero", "bairro", "cidade", "cep"] as const;

function hasEndereco(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj !== null && "rua" in obj && "numero" in obj && "bairro" in obj && "cidade" in obj && "cep" in obj;
}

export function validateCreateDriver(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Body inválido" });
    return;
  }
  for (const k of requiredCreate) {
    if (body[k] === undefined || body[k] === null || body[k] === "") {
      res.status(400).json({ error: `Campo obrigatório: ${k}` });
      return;
    }
  }
  if (!hasEndereco(body.endereco)) {
    res.status(400).json({ error: "endereco deve ter: rua, numero, bairro, cidade, cep" });
    return;
  }
  for (const k of requiredEndereco) {
    if (body.endereco[k] === undefined || body.endereco[k] === null || String(body.endereco[k]).trim() === "") {
      res.status(400).json({ error: `endereco.${k} é obrigatório` });
      return;
    }
  }
  next();
}

export function validateUpdateDriver(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Body inválido" });
    return;
  }
  if (body.endereco !== undefined) {
    if (!hasEndereco(body.endereco)) {
      res.status(400).json({ error: "endereco deve ter: rua, numero, bairro, cidade, cep" });
      return;
    }
    for (const k of requiredEndereco) {
      if (body.endereco[k] === undefined || body.endereco[k] === null || String(body.endereco[k]).trim() === "") {
        res.status(400).json({ error: `endereco.${k} é obrigatório` });
        return;
      }
    }
  }
  next();
}

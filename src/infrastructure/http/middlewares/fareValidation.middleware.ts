import { Request, Response, NextFunction } from "express";

function hasLatLng(obj: unknown): obj is { lat: number; lng: number } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "lat" in obj &&
    "lng" in obj &&
    typeof (obj as { lat: unknown }).lat === "number" &&
    typeof (obj as { lng: unknown }).lng === "number"
  );
}

export function validateCalculateFare(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Body inválido" });
    return;
  }
  if (!hasLatLng(body.from)) {
    res.status(400).json({ error: "from deve ter lat e lng (números)" });
    return;
  }
  if (!hasLatLng(body.to)) {
    res.status(400).json({ error: "to deve ter lat e lng (números)" });
    return;
  }
  if (typeof body.datetime !== "string" || body.datetime.trim() === "") {
    res.status(400).json({ error: "datetime é obrigatório (ISO 8601 com timezone, ex: 2025-01-15T08:00:00-03:00)" });
    return;
  }
  next();
}

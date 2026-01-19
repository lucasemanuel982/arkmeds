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

export function validateAcceptRace(req: Request, res: Response, next: NextFunction): void {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Body inválido" });
    return;
  }
  if (typeof body.userId !== "string" || body.userId.trim() === "") {
    res.status(400).json({ error: "userId é obrigatório (ID do passageiro)" });
    return;
  }
  if (typeof body.requestId !== "string" || body.requestId.trim() === "") {
    res.status(400).json({ error: "requestId é obrigatório" });
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
  if (typeof body.price !== "number" || body.price < 0 || !Number.isFinite(body.price)) {
    res.status(400).json({ error: "price é obrigatório e deve ser um número não negativo" });
    return;
  }
  if (typeof body.distanceKm !== "number" || body.distanceKm < 0 || !Number.isFinite(body.distanceKm)) {
    res.status(400).json({ error: "distanceKm é obrigatório e deve ser um número não negativo" });
    return;
  }
  if (typeof body.datetime !== "string" || body.datetime.trim() === "") {
    res.status(400).json({ error: "datetime é obrigatório (ISO 8601 com timezone)" });
    return;
  }
  next();
}

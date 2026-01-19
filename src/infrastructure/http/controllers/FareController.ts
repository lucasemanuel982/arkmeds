import { Request, Response } from "express";
import { CalculateFare } from "../../../application/fare/use-cases/CalculateFare";

const calculateFare = new CalculateFare();

export async function calculate(req: Request, res: Response): Promise<void> {
  const { from, to, datetime } = req.body;
  const result = await Promise.resolve(calculateFare.execute({ from, to, datetime }));
  res.status(200).json(result);
}

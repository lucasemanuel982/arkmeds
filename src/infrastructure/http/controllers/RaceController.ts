import { Request, Response } from "express";
import { RaceRepository } from "../../persistence/repositories/RaceRepository";
import { PassengerRepository } from "../../persistence/repositories/PassengerRepository";
import { PostgresReceiptWriter } from "../../race/PostgresReceiptWriter";
import { InMemoryRaceAcceptedNotifier } from "../../race/InMemoryRaceAcceptedNotifier";
import { AcceptRace } from "../../../application/race/use-cases/AcceptRace";
import { GenerateReceipt } from "../../../application/race/use-cases/GenerateReceipt";

const raceRepository = new RaceRepository();
const passengerRepository = new PassengerRepository();
const receiptWriter = new PostgresReceiptWriter();
const generateReceipt = new GenerateReceipt(receiptWriter);
const notifier = new InMemoryRaceAcceptedNotifier((r) => generateReceipt.execute(r));
const acceptRace = new AcceptRace(raceRepository, passengerRepository, notifier);

export async function accept(req: Request, res: Response): Promise<void> {
  const { userId, requestId, from, to, price, distanceKm, datetime } = req.body;
  const race = await acceptRace.execute({ userId, requestId, from, to, price, distanceKm, datetime });
  res.status(202).json({
    id: race.id,
    passengerId: race.passengerId,
    requestId: race.requestId,
    status: "accepted",
  });
}

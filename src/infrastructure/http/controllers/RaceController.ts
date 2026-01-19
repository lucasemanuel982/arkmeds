import { Request, Response } from "express";
import { RaceRepository } from "../../persistence/repositories/RaceRepository";
import { PassengerRepository } from "../../persistence/repositories/PassengerRepository";
import { FileSystemReceiptFileWriter } from "../../race/FileSystemReceiptFileWriter";
import { InMemoryRaceAcceptedNotifier } from "../../race/InMemoryRaceAcceptedNotifier";
import { AcceptRace } from "../../../application/race/use-cases/AcceptRace";
import { GenerateReceipt } from "../../../application/race/use-cases/GenerateReceipt";
import { env } from "../../config/env";

const raceRepository = new RaceRepository();
const passengerRepository = new PassengerRepository();
const fileWriter = new FileSystemReceiptFileWriter(env.receipt.basePath);
const generateReceipt = new GenerateReceipt(fileWriter);
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

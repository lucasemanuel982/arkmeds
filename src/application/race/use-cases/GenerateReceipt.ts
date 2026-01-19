import { IReceiptFileWriter } from "../IReceiptFileWriter";
import { Race } from "../../../domain/race/Race";

function formatDateYyyyMmDd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class GenerateReceipt {
  constructor(private readonly fileWriter: IReceiptFileWriter) {}

  async execute(race: Race): Promise<void> {
    const date = formatDateYyyyMmDd(race.acceptedAt);
    const payload = {
      id: race.id,
      requestId: race.requestId,
      passengerId: race.passengerId,
      from: race.from,
      to: race.to,
      price: race.price,
      distanceKm: race.distanceKm,
      acceptedAt: race.acceptedAt.toISOString(),
    };
    const content = JSON.stringify(payload, null, 2);
    await this.fileWriter.write(race.passengerId, date, content);
  }
}

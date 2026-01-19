import { IRaceAcceptedNotifier } from "../../application/race/IRaceAcceptedNotifier";
import { Race } from "../../domain/race/Race";

export class InMemoryRaceAcceptedNotifier implements IRaceAcceptedNotifier {
  constructor(private readonly onPublish: (race: Race) => Promise<void>) {}

  publish(race: Race): Promise<void> {
    setImmediate(() => {
      this.onPublish(race).catch((err) => console.error("GenerateReceipt error:", err));
    });
    return Promise.resolve();
  }
}

import { IRaceAcceptedNotifier } from "../../application/race/IRaceAcceptedNotifier";
import { Race } from "../../domain/race/Race";
import { logger } from "../../shared/logger";

export class InMemoryRaceAcceptedNotifier implements IRaceAcceptedNotifier {
  constructor(private readonly onPublish: (race: Race) => Promise<void>) {}

  publish(race: Race): Promise<void> {
    setImmediate(() => {
      this.onPublish(race).catch((err) =>
        logger.error({ err }, "GenerateReceipt error")
      );
    });
    return Promise.resolve();
  }
}

import { Race } from "../../domain/race/Race";

export interface IRaceAcceptedNotifier {
  publish(race: Race): Promise<void>;
}

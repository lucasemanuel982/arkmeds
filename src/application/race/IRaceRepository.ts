import { Race } from "../../domain/race/Race";

export interface IRaceRepository {
  save(race: Race): Promise<Race>;
  findById(id: string): Promise<Race | null>;
}

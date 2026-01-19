import { IRaceRepository } from "../IRaceRepository";
import { IRaceAcceptedNotifier } from "../IRaceAcceptedNotifier";
import { IPassengerRepository } from "../../passenger/IPassengerRepository";
import { PassengerNotFoundError } from "../../../shared/errors/AppError";
import { AcceptRaceInput, Race } from "../../../domain/race/Race";

export class AcceptRace {
  constructor(
    private readonly raceRepository: IRaceRepository,
    private readonly passengerRepository: IPassengerRepository,
    private readonly notifier: IRaceAcceptedNotifier
  ) {}

  async execute(input: AcceptRaceInput): Promise<Race> {
    const passenger = await this.passengerRepository.findById(input.userId);
    if (!passenger) throw new PassengerNotFoundError("Passageiro não encontrado");

    const acceptedAt = new Date(input.datetime);
    const race: Omit<Race, "id"> = {
      passengerId: input.userId,
      requestId: input.requestId,
      from: input.from,
      to: input.to,
      price: input.price,
      distanceKm: input.distanceKm,
      acceptedAt: isNaN(acceptedAt.getTime()) ? new Date() : acceptedAt,
    };

    const saved = await this.raceRepository.save(race as Race);
    this.notifier.publish(saved).catch(() => {});
    return saved;
  }
}

import { IPassengerRepository } from "../IPassengerRepository";
import { PassengerNotFoundError } from "../../../shared/errors/AppError";
import { Passenger } from "../../../domain/passenger/Passenger";

export class GetPassenger {
  constructor(private readonly repository: IPassengerRepository) {}

  async execute(id: string): Promise<Passenger> {
    const passenger = await this.repository.findById(id);
    if (!passenger) throw new PassengerNotFoundError("Passageiro não encontrado");
    return passenger;
  }
}

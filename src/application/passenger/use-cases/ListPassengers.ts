import { IPassengerRepository } from "../IPassengerRepository";
import { Passenger } from "../../../domain/passenger/Passenger";

export class ListPassengers {
  constructor(private readonly repository: IPassengerRepository) {}

  async execute(): Promise<Passenger[]> {
    return this.repository.findAll();
  }
}

import { IPassengerRepository } from "../IPassengerRepository";
import { PassengerNotFoundError } from "../../../shared/errors/AppError";

export class DeletePassenger {
  constructor(private readonly repository: IPassengerRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new PassengerNotFoundError("Passageiro não encontrado");
  }
}

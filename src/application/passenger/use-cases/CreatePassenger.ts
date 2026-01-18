import { IPassengerRepository } from "../IPassengerRepository";
import { PassengerFactory } from "../PassengerFactory";
import { CpfDuplicadoError } from "../../../shared/errors/AppError";
import { CreatePassengerInput, Passenger } from "../../../domain/passenger/Passenger";

export class CreatePassenger {
  constructor(private readonly repository: IPassengerRepository) {}

  async execute(input: CreatePassengerInput): Promise<Passenger> {
    const existing = await this.repository.findByCpf(input.cpf);
    if (existing) throw new CpfDuplicadoError("CPF já cadastrado");

    const passenger = PassengerFactory.create(input);
    return this.repository.save(passenger);
  }
}

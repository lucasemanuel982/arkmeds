import { IPassengerRepository } from "../IPassengerRepository";
import { PassengerFactory } from "../PassengerFactory";
import { CpfDuplicadoError, PassengerNotFoundError } from "../../../shared/errors/AppError";
import { UpdatePassengerInput, Passenger } from "../../../domain/passenger/Passenger";

export class UpdatePassenger {
  constructor(private readonly repository: IPassengerRepository) {}

  async execute(id: string, input: UpdatePassengerInput): Promise<Passenger> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new PassengerNotFoundError("Passageiro não encontrado");

    if (input.cpf !== undefined) {
      const byCpf = await this.repository.findByCpf(input.cpf, id);
      if (byCpf) throw new CpfDuplicadoError("CPF já cadastrado");
    }

    const data = PassengerFactory.createForUpdate(input);
    const updated = await this.repository.update(id, data);
    if (!updated) throw new PassengerNotFoundError("Passageiro não encontrado");
    return updated;
  }
}

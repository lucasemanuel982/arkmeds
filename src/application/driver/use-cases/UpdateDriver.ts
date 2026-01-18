import { IDriverRepository } from "../IDriverRepository";
import { DriverFactory } from "../DriverFactory";
import { CpfDuplicadoError, DriverNotFoundError } from "../../../shared/errors/AppError";
import { UpdateDriverInput, Driver } from "../../../domain/driver/Driver";

export class UpdateDriver {
  constructor(private readonly repository: IDriverRepository) {}

  async execute(id: string, input: UpdateDriverInput): Promise<Driver> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DriverNotFoundError("Motorista não encontrado");

    if (input.cpf !== undefined) {
      const byCpf = await this.repository.findByCpf(input.cpf, id);
      if (byCpf) throw new CpfDuplicadoError("CPF já cadastrado");
    }

    const data = DriverFactory.createForUpdate(input);
    const updated = await this.repository.update(id, data);
    if (!updated) throw new DriverNotFoundError("Motorista não encontrado");
    return updated;
  }
}

import { IDriverRepository } from "../IDriverRepository";
import { DriverFactory } from "../DriverFactory";
import { CpfDuplicadoError } from "../../../shared/errors/AppError";
import { CreateDriverInput, Driver } from "../../../domain/driver/Driver";

export class CreateDriver {
  constructor(private readonly repository: IDriverRepository) {}

  async execute(input: CreateDriverInput): Promise<Driver> {
    const existing = await this.repository.findByCpf(input.cpf);
    if (existing) throw new CpfDuplicadoError("CPF já cadastrado");

    const driver = DriverFactory.create(input);
    return this.repository.save(driver);
  }
}

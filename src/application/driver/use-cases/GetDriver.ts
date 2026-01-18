import { IDriverRepository } from "../IDriverRepository";
import { DriverNotFoundError } from "../../../shared/errors/AppError";
import { Driver } from "../../../domain/driver/Driver";

export class GetDriver {
  constructor(private readonly repository: IDriverRepository) {}

  async execute(id: string): Promise<Driver> {
    const driver = await this.repository.findById(id);
    if (!driver) throw new DriverNotFoundError("Motorista não encontrado");
    return driver;
  }
}

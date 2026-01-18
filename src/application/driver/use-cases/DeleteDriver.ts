import { IDriverRepository } from "../IDriverRepository";
import { DriverNotFoundError } from "../../../shared/errors/AppError";

export class DeleteDriver {
  constructor(private readonly repository: IDriverRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new DriverNotFoundError("Motorista não encontrado");
  }
}

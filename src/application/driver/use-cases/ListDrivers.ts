import { IDriverRepository } from "../IDriverRepository";
import { Driver } from "../../../domain/driver/Driver";

export class ListDrivers {
  constructor(private readonly repository: IDriverRepository) {}

  async execute(): Promise<Driver[]> {
    return this.repository.findAll();
  }
}

import { Driver } from "../../domain/driver/Driver";

export interface IDriverRepository {
  save(driver: Driver): Promise<Driver>;
  findById(id: string): Promise<Driver | null>;
  findAll(): Promise<Driver[]>;
  findByCpf(cpf: string, excludeId?: string): Promise<Driver | null>;
  update(id: string, data: Partial<Driver>): Promise<Driver | null>;
  delete(id: string): Promise<boolean>;
}

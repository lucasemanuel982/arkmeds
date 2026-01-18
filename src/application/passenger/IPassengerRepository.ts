import { Passenger } from "../../domain/passenger/Passenger";

export interface IPassengerRepository {
  save(passenger: Passenger): Promise<Passenger>;
  findById(id: string): Promise<Passenger | null>;
  findAll(): Promise<Passenger[]>;
  findByCpf(cpf: string, excludeId?: string): Promise<Passenger | null>;
  update(id: string, data: Partial<Passenger>): Promise<Passenger | null>;
  delete(id: string): Promise<boolean>;
}

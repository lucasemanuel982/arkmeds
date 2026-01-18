export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export interface Passenger {
  id?: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  endereco: Endereco;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreatePassengerInput = Omit<Passenger, "id" | "createdAt" | "updatedAt">;
export type UpdatePassengerInput = Partial<CreatePassengerInput>;

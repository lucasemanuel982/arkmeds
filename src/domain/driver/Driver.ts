export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
}

export interface Driver {
  id?: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: string;
  endereco: Endereco;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateDriverInput = Omit<Driver, "id" | "createdAt" | "updatedAt">;
export type UpdateDriverInput = Partial<CreateDriverInput>;

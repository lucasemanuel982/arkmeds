import { validateCpf } from "../../shared/validators/cpf";
import { validateDateOfBirth } from "../../shared/validators/dateOfBirth";
import { InvalidCpfError, InvalidDateOfBirthError } from "../../shared/errors/AppError";
import { CreateDriverInput, Driver } from "../../domain/driver/Driver";

export class DriverFactory {
  static create(input: CreateDriverInput): Driver {
    if (!validateCpf(input.cpf)) {
      throw new InvalidCpfError("CPF inválido");
    }
    if (!validateDateOfBirth(input.dataNascimento)) {
      throw new InvalidDateOfBirthError("Data de nascimento inválida");
    }
    return {
      nome: input.nome,
      cpf: input.cpf.replace(/\D/g, ""),
      dataNascimento: input.dataNascimento,
      sexo: input.sexo,
      endereco: input.endereco,
    };
  }

  static createForUpdate(input: Partial<CreateDriverInput>): Partial<Driver> {
    const result: Partial<Driver> = {};
    if (input.nome !== undefined) result.nome = input.nome;
    if (input.sexo !== undefined) result.sexo = input.sexo;
    if (input.endereco !== undefined) result.endereco = input.endereco;
    if (input.cpf !== undefined) {
      if (!validateCpf(input.cpf)) throw new InvalidCpfError("CPF inválido");
      result.cpf = input.cpf.replace(/\D/g, "");
    }
    if (input.dataNascimento !== undefined) {
      if (!validateDateOfBirth(input.dataNascimento))
        throw new InvalidDateOfBirthError("Data de nascimento inválida");
      result.dataNascimento = input.dataNascimento;
    }
    return result;
  }
}

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class InvalidCpfError extends AppError {
  constructor(message = "CPF inválido") {
    super(message, 400);
    this.name = "InvalidCpfError";
  }
}

export class InvalidDateOfBirthError extends AppError {
  constructor(message = "Data de nascimento inválida") {
    super(message, 400);
    this.name = "InvalidDateOfBirthError";
  }
}

export class CpfDuplicadoError extends AppError {
  constructor(message = "CPF já cadastrado") {
    super(message, 409);
    this.name = "CpfDuplicadoError";
  }
}

export class DriverNotFoundError extends AppError {
  constructor(message = "Motorista não encontrado") {
    super(message, 404);
    this.name = "DriverNotFoundError";
  }
}

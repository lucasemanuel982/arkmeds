import { DriverFactory } from "./DriverFactory";
import { InvalidCpfError, InvalidDateOfBirthError } from "../../shared/errors/AppError";

const input = {
  nome: "João",
  cpf: "111.444.777-35",
  dataNascimento: "1990-05-15",
  sexo: "M",
  endereco: { rua: "Rua A", numero: "1", bairro: "Centro", cidade: "São Paulo", cep: "01000-000" },
};

describe("DriverFactory", () => {
  describe("create", () => {
    it("deve criar Driver quando CPF e data são válidos", () => {
      const d = DriverFactory.create(input);
      expect(d.nome).toBe("João");
      expect(d.cpf).toBe("11144477735");
      expect(d.dataNascimento).toBe("1990-05-15");
      expect(d.sexo).toBe("M");
      expect(d.endereco).toEqual(input.endereco);
    });

    it("deve lançar InvalidCpfError para 111.444.777-05", () => {
      expect(() => DriverFactory.create({ ...input, cpf: "111.444.777-05" })).toThrow(InvalidCpfError);
    });

    it("deve lançar InvalidDateOfBirthError para data futura", () => {
      expect(() => DriverFactory.create({ ...input, dataNascimento: "2030-01-01" })).toThrow(InvalidDateOfBirthError);
    });

    it("deve lançar InvalidDateOfBirthError para data inválida", () => {
      expect(() => DriverFactory.create({ ...input, dataNascimento: "invalido" })).toThrow(InvalidDateOfBirthError);
    });
  });

  describe("createForUpdate", () => {
    it("deve retornar apenas campos enviados e validar CPF/data se presentes", () => {
      const r = DriverFactory.createForUpdate({ nome: "Maria" });
      expect(r).toEqual({ nome: "Maria" });
    });

    it("deve lançar InvalidCpfError se cpf inválido no update", () => {
      expect(() => DriverFactory.createForUpdate({ cpf: "111.444.777-05" })).toThrow(InvalidCpfError);
    });

    it("deve lançar InvalidDateOfBirthError se data inválida no update", () => {
      expect(() => DriverFactory.createForUpdate({ dataNascimento: "2030-01-01" })).toThrow(InvalidDateOfBirthError);
    });
  });
});

import { PassengerFactory } from "./PassengerFactory";
import { InvalidCpfError, InvalidDateOfBirthError } from "../../shared/errors/AppError";

const input = {
  nome: "Maria",
  cpf: "111.444.777-35",
  dataNascimento: "1992-08-20",
  sexo: "F",
  endereco: { rua: "Rua B", numero: "2", bairro: "Centro", cidade: "Rio de Janeiro", cep: "20000-000" },
};

describe("PassengerFactory", () => {
  describe("create", () => {
    it("deve criar Passenger quando CPF e data são válidos", () => {
      const p = PassengerFactory.create(input);
      expect(p.nome).toBe("Maria");
      expect(p.cpf).toBe("11144477735");
      expect(p.dataNascimento).toBe("1992-08-20");
      expect(p.sexo).toBe("F");
      expect(p.endereco).toEqual(input.endereco);
    });

    it("deve lançar InvalidCpfError para 111.444.777-05", () => {
      expect(() => PassengerFactory.create({ ...input, cpf: "111.444.777-05" })).toThrow(InvalidCpfError);
    });

    it("deve lançar InvalidDateOfBirthError para data futura", () => {
      expect(() => PassengerFactory.create({ ...input, dataNascimento: "2030-01-01" })).toThrow(InvalidDateOfBirthError);
    });

    it("deve lançar InvalidDateOfBirthError para data inválida", () => {
      expect(() => PassengerFactory.create({ ...input, dataNascimento: "invalido" })).toThrow(InvalidDateOfBirthError);
    });
  });

  describe("createForUpdate", () => {
    it("deve retornar apenas campos enviados e validar CPF/data se presentes", () => {
      const r = PassengerFactory.createForUpdate({ nome: "Maria Silva" });
      expect(r).toEqual({ nome: "Maria Silva" });
    });

    it("deve lançar InvalidCpfError se cpf inválido no update", () => {
      expect(() => PassengerFactory.createForUpdate({ cpf: "111.444.777-05" })).toThrow(InvalidCpfError);
    });

    it("deve lançar InvalidDateOfBirthError se data inválida no update", () => {
      expect(() => PassengerFactory.createForUpdate({ dataNascimento: "2030-01-01" })).toThrow(InvalidDateOfBirthError);
    });
  });
});

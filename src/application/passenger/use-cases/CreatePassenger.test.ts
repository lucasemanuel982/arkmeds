import { CreatePassenger } from "./CreatePassenger";
import { CpfDuplicadoError } from "../../../shared/errors/AppError";
import { InvalidCpfError } from "../../../shared/errors/AppError";
import { IPassengerRepository } from "../IPassengerRepository";

const input = {
  nome: "Maria",
  cpf: "111.444.777-35",
  dataNascimento: "1992-08-20",
  sexo: "F",
  endereco: { rua: "Rua B", numero: "2", bairro: "Centro", cidade: "Rio de Janeiro", cep: "20000-000" },
};

function makeRepo(overrides: Partial<IPassengerRepository> = {}): IPassengerRepository {
  return {
    save: jest.fn().mockResolvedValue({ id: "uuid-1", ...input }),
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    findByCpf: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

describe("CreatePassenger", () => {
  it("deve salvar e retornar passenger quando CPF não existe", async () => {
    const repo = makeRepo();
    const save = repo.save as jest.Mock;
    save.mockResolvedValue({ id: "u1", ...input });

    const uc = new CreatePassenger(repo);
    const out = await uc.execute(input);

    expect(repo.findByCpf).toHaveBeenCalledWith(input.cpf);
    expect(repo.save).toHaveBeenCalled();
    expect(out.id).toBe("u1");
  });

  it("deve lançar CpfDuplicadoError quando CPF já existe", async () => {
    const repo = makeRepo({ findByCpf: jest.fn().mockResolvedValue({ id: "x" }) });

    const uc = new CreatePassenger(repo);
    await expect(uc.execute(input)).rejects.toThrow(CpfDuplicadoError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("deve lançar InvalidCpfError quando CPF é inválido", async () => {
    const repo = makeRepo();

    const uc = new CreatePassenger(repo);
    await expect(uc.execute({ ...input, cpf: "111.444.777-05" })).rejects.toThrow(InvalidCpfError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});

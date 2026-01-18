import { validateCpf } from "../cpf";

describe("validateCpf", () => {
  it("deve retornar false para 111.444.777-05 (inválido)", () => {
    expect(validateCpf("111.444.777-05")).toBe(false);
  });

  it("deve retornar true para 111.444.777-35 (válido)", () => {
    expect(validateCpf("111.444.777-35")).toBe(true);
  });

  it("deve aceitar CPF apenas com dígitos", () => {
    expect(validateCpf("11144477735")).toBe(true);
  });

  it("deve retornar false para CPF com menos de 11 dígitos", () => {
    expect(validateCpf("1114447773")).toBe(false);
  });

  it("deve retornar false para CPF com mais de 11 dígitos", () => {
    expect(validateCpf("111444777356")).toBe(false);
  });

  it("deve retornar false para todos os dígitos iguais", () => {
    expect(validateCpf("11111111111")).toBe(false);
  });
});

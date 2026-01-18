import { validateDateOfBirth } from "../dateOfBirth";

describe("validateDateOfBirth", () => {
  it("deve retornar true para data válida no passado", () => {
    expect(validateDateOfBirth("1990-05-15")).toBe(true);
  });

  it("deve retornar false para data futura", () => {
    expect(validateDateOfBirth("2030-01-01")).toBe(false);
  });

  it("deve retornar false para string inválida", () => {
    expect(validateDateOfBirth("data-invalida")).toBe(false);
  });

  it("deve retornar false para mês inválido (13)", () => {
    expect(validateDateOfBirth("1990-13-01")).toBe(false);
  });

  it("deve retornar false para dia inválido (32)", () => {
    expect(validateDateOfBirth("1990-01-32")).toBe(false);
  });

  it("deve retornar false para string vazia", () => {
    expect(validateDateOfBirth("")).toBe(false);
  });
});

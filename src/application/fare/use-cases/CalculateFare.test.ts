import { CalculateFare } from "./CalculateFare";
import { InvalidCoordinatesError, InvalidDateTimeError } from "../../../shared/errors/AppError";

const input = {
  from: { lat: -23.55, lng: -46.63 },
  to: { lat: -22.9, lng: -47.06 },
  datetime: "2025-01-15T08:00:00-03:00",
};

function makeDeps(overrides: Record<string, unknown> = {}) {
  return {
    getDistance: jest.fn().mockReturnValue(100),
    getStrategy: jest.fn().mockReturnValue({
      name: "day",
      calculate: (b: number, r: number, d: number) => b + r * d,
    }),
    getTariff: jest.fn().mockReturnValue({ base: 5, ratePerKm: 2 }),
    ...overrides,
  };
}

describe("CalculateFare", () => {
  it("retorna fare, distanceKm e strategy usando mocks", () => {
    const deps = makeDeps();
    const uc = new CalculateFare(deps);

    const result = uc.execute(input);

    expect(deps.getDistance).toHaveBeenCalledWith(
      expect.objectContaining({ lat: -23.55, lng: -46.63 }),
      expect.objectContaining({ lat: -22.9, lng: -47.06 })
    );
    expect(deps.getStrategy).toHaveBeenCalled();
    expect(deps.getTariff).toHaveBeenCalledWith("day");
    expect(result.fare).toBe(5 + 2 * 100);
    expect(result.distanceKm).toBe(100);
    expect(result.strategy).toBe("day");
  });

  it("usa distância mockada 10 km e tarifa night", () => {
    const deps = makeDeps({
      getDistance: jest.fn().mockReturnValue(10),
      getStrategy: jest.fn().mockReturnValue({
        name: "night",
        calculate: (b: number, r: number, d: number) => b + r * d,
      }),
      getTariff: jest.fn().mockReturnValue({ base: 7, ratePerKm: 2.5 }),
    });
    const uc = new CalculateFare(deps);

    const result = uc.execute(input);

    expect(result.fare).toBe(7 + 2.5 * 10);
    expect(result.distanceKm).toBe(10);
    expect(result.strategy).toBe("night");
  });

  it("arredonda fare e distanceKm", () => {
    const deps = makeDeps({
      getDistance: jest.fn().mockReturnValue(3.4567),
      getStrategy: jest.fn().mockReturnValue({
        name: "day",
        calculate: () => 12.34567,
      }),
      getTariff: jest.fn().mockReturnValue({ base: 0, ratePerKm: 0 }),
    });
    const uc = new CalculateFare(deps);
    const result = uc.execute(input);
    expect(result.fare).toBe(12.35);
    expect(result.distanceKm).toBe(3.457);
  });

  it("lança InvalidCoordinatesError quando from é inválido", () => {
    const uc = new CalculateFare(makeDeps());
    expect(() => uc.execute({ ...input, from: { lat: 100, lng: 0 } })).toThrow(InvalidCoordinatesError);
  });

  it("lança InvalidCoordinatesError quando to é inválido", () => {
    const uc = new CalculateFare(makeDeps());
    expect(() => uc.execute({ ...input, to: { lat: 0, lng: 200 } })).toThrow(InvalidCoordinatesError);
  });

  it("lança InvalidDateTimeError quando datetime é inválido", () => {
    const uc = new CalculateFare(makeDeps());
    expect(() => uc.execute({ ...input, datetime: "invalido" })).toThrow(InvalidDateTimeError);
  });

  it("funciona sem deps (usa implementações reais)", () => {
    const uc = new CalculateFare();
    const result = uc.execute({
      from: { lat: -23.55, lng: -46.63 },
      to: { lat: -23.55, lng: -46.64 },
      datetime: "2025-01-15T08:00:00-03:00",
    });
    expect(result.fare).toBeGreaterThan(0);
    expect(result.distanceKm).toBeGreaterThan(0);
    expect(result.strategy).toBe("day");
  });
});

import {
  fareFormula,
  DayFare,
  NightFare,
  WeekendDayFare,
  WeekendNightFare,
} from "./FareStrategy";
import { RequestDateTime } from "./RequestDateTime";
import { selectTariffStrategy } from "./TariffStrategySelector";

describe("fareFormula", () => {
  it("retorna base quando distância é 0", () => {
    expect(fareFormula(5, 2, 0)).toBe(5);
  });

  it("aplica base + ratePerKm * distanceKm", () => {
    expect(fareFormula(5, 2, 10)).toBe(5 + 2 * 10);
    expect(fareFormula(0, 3, 5)).toBe(15);
  });
});

describe("DayFare", () => {
  it("usa fórmula base + rate * distância", () => {
    const s = new DayFare();
    expect(s.calculate(5, 2, 10)).toBe(25);
  });
});

describe("NightFare", () => {
  it("usa fórmula base + rate * distância", () => {
    const s = new NightFare();
    expect(s.calculate(7, 2.5, 4)).toBe(7 + 2.5 * 4);
  });
});

describe("WeekendDayFare", () => {
  it("usa fórmula base + rate * distância", () => {
    const s = new WeekendDayFare();
    expect(s.calculate(6, 2.2, 5)).toBe(6 + 2.2 * 5);
  });
});

describe("WeekendNightFare", () => {
  it("usa fórmula base + rate * distância", () => {
    const s = new WeekendNightFare();
    expect(s.calculate(8, 3, 2)).toBe(8 + 3 * 2);
  });
});

/** Horários limítrofes: 06:00 início do dia, 22:00 início da noite. */
describe("FareStrategy - horários limítrofes (via TariffStrategySelector)", () => {
  const tz = "-03:00";

  it("05:59 dia útil → night", () => {
    const dt = new RequestDateTime(`2025-01-15T05:59:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("night");
  });

  it("06:00 dia útil → day", () => {
    const dt = new RequestDateTime(`2025-01-15T06:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("day");
  });

  it("06:01 dia útil → day", () => {
    const dt = new RequestDateTime(`2025-01-15T06:01:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("day");
  });

  it("21:59 dia útil → day", () => {
    const dt = new RequestDateTime(`2025-01-15T21:59:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("day");
  });

  it("22:00 dia útil → night", () => {
    const dt = new RequestDateTime(`2025-01-15T22:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("night");
  });

  it("22:01 dia útil → night", () => {
    const dt = new RequestDateTime(`2025-01-15T22:01:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("night");
  });

  it("23:00 dia útil → night", () => {
    const dt = new RequestDateTime(`2025-01-15T23:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("night");
  });

  it("02:00 dia útil → night", () => {
    const dt = new RequestDateTime(`2025-01-16T02:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("night");
  });

  it("05:59 sábado → weekend_night", () => {
    const dt = new RequestDateTime(`2025-01-18T05:59:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("weekend_night");
  });

  it("06:00 sábado → weekend_day", () => {
    const dt = new RequestDateTime(`2025-01-18T06:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("weekend_day");
  });

  it("21:59 domingo → weekend_day", () => {
    const dt = new RequestDateTime(`2025-01-19T21:59:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("weekend_day");
  });

  it("22:00 domingo → weekend_night", () => {
    const dt = new RequestDateTime(`2025-01-19T22:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("weekend_night");
  });

  it("02:00 domingo → weekend_night", () => {
    const dt = new RequestDateTime(`2025-01-19T02:00:00${tz}`);
    expect(selectTariffStrategy(dt).name).toBe("weekend_night");
  });
});

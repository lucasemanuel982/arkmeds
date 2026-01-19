import { RequestDateTime } from "./RequestDateTime";
import { selectTariffStrategy } from "./TariffStrategySelector";

const tz = "-03:00";

describe("TariffStrategySelector", () => {
  describe("dia útil", () => {
    it("08:00 → day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-15T08:00:00${tz}`)).name).toBe("day");
    });

    it("17:00 → day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-15T17:00:00${tz}`)).name).toBe("day");
    });

    it("20:00 → day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-15T20:00:00${tz}`)).name).toBe("day");
    });

    it("23:00 → night", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-15T23:00:00${tz}`)).name).toBe("night");
    });

    it("02:00 → night", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-16T02:00:00${tz}`)).name).toBe("night");
    });
  });

  describe("fim de semana", () => {
    it("08:00 sábado → weekend_day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-18T08:00:00${tz}`)).name).toBe("weekend_day");
    });

    it("17:00 domingo → weekend_day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-19T17:00:00${tz}`)).name).toBe("weekend_day");
    });

    it("20:00 sábado → weekend_day", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-18T20:00:00${tz}`)).name).toBe("weekend_day");
    });

    it("23:00 sábado → weekend_night", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-18T23:00:00${tz}`)).name).toBe("weekend_night");
    });

    it("02:00 domingo → weekend_night", () => {
      expect(selectTariffStrategy(new RequestDateTime(`2025-01-19T02:00:00${tz}`)).name).toBe("weekend_night");
    });
  });
});

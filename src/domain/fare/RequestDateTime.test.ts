import { RequestDateTime } from "./RequestDateTime";
import { InvalidDateTimeError } from "../../shared/errors/AppError";

describe("RequestDateTime", () => {
  describe("constructor", () => {
    it("aceita ISO com timezone -03:00", () => {
      const dt = new RequestDateTime("2025-01-15T08:00:00-03:00");
      expect(dt.iso).toBe("2025-01-15T08:00:00-03:00");
      expect(dt.getHours()).toBe(8);
      expect(dt.getMinutes()).toBe(0);
      expect(dt.getMinutesSinceMidnight()).toBe(8 * 60);
    });

    it("aceita ISO com Z", () => {
      const dt = new RequestDateTime("2025-01-15T17:00:00Z");
      expect(dt.getHours()).toBe(17);
      expect(dt.getMinutesSinceMidnight()).toBe(17 * 60);
    });

    it("aceita ISO com +01:00", () => {
      const dt = new RequestDateTime("2025-01-15T20:00:00+01:00");
      expect(dt.getHours()).toBe(20);
    });

    it("lança para string vazia", () => {
      expect(() => new RequestDateTime("")).toThrow(InvalidDateTimeError);
      expect(() => new RequestDateTime("   ")).toThrow(InvalidDateTimeError);
    });

    it("lança para datetime inválido", () => {
      expect(() => new RequestDateTime("não é data")).toThrow(InvalidDateTimeError);
    });

    it("lança para tipo não string", () => {
      expect(() => new RequestDateTime(123 as unknown as string)).toThrow(InvalidDateTimeError);
    });
  });

  describe("getDayOfWeek e isWeekend", () => {
    it("quarta 15/01/2025 -03:00 é dia útil", () => {
      const dt = new RequestDateTime("2025-01-15T12:00:00-03:00");
      expect(dt.getDayOfWeek()).toBe(3);
      expect(dt.isWeekend()).toBe(false);
    });

    it("sábado 18/01/2025 -03:00 é fim de semana", () => {
      const dt = new RequestDateTime("2025-01-18T12:00:00-03:00");
      expect(dt.getDayOfWeek()).toBe(6);
      expect(dt.isWeekend()).toBe(true);
    });

    it("domingo 19/01/2025 -03:00 é fim de semana", () => {
      const dt = new RequestDateTime("2025-01-19T12:00:00-03:00");
      expect(dt.getDayOfWeek()).toBe(0);
      expect(dt.isWeekend()).toBe(true);
    });
  });

  describe("hora local com offset", () => {
    it("23:00 -03:00 tem getMinutesSinceMidnight 23*60", () => {
      const dt = new RequestDateTime("2025-01-15T23:00:00-03:00");
      expect(dt.getHours()).toBe(23);
      expect(dt.getMinutesSinceMidnight()).toBe(23 * 60);
    });

    it("02:00 -03:00 tem getMinutesSinceMidnight 2*60", () => {
      const dt = new RequestDateTime("2025-01-16T02:00:00-03:00");
      expect(dt.getHours()).toBe(2);
      expect(dt.getMinutesSinceMidnight()).toBe(2 * 60);
    });
  });
});

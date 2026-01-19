import { GeoLocation } from "./GeoLocation";
import { InvalidCoordinatesError } from "../../shared/errors/AppError";

describe("GeoLocation", () => {
  describe("constructor", () => {
    it("aceita coordenadas válidas", () => {
      const g = new GeoLocation({ lat: 0, lng: 0 });
      expect(g.lat).toBe(0);
      expect(g.lng).toBe(0);
    });

    it("aceita lat -90 e 90", () => {
      expect(new GeoLocation({ lat: -90, lng: 0 }).lat).toBe(-90);
      expect(new GeoLocation({ lat: 90, lng: 0 }).lat).toBe(90);
    });

    it("aceita lng -180 e 180", () => {
      expect(new GeoLocation({ lat: 0, lng: -180 }).lng).toBe(-180);
      expect(new GeoLocation({ lat: 0, lng: 180 }).lng).toBe(180);
    });

    it("lança InvalidCoordinatesError para lat > 90", () => {
      expect(() => new GeoLocation({ lat: 90.01, lng: 0 })).toThrow(InvalidCoordinatesError);
      expect(() => new GeoLocation({ lat: 91, lng: 0 })).toThrow(InvalidCoordinatesError);
    });

    it("lança InvalidCoordinatesError para lat < -90", () => {
      expect(() => new GeoLocation({ lat: -90.01, lng: 0 })).toThrow(InvalidCoordinatesError);
    });

    it("lança InvalidCoordinatesError para lng > 180", () => {
      expect(() => new GeoLocation({ lat: 0, lng: 180.01 })).toThrow(InvalidCoordinatesError);
    });

    it("lança InvalidCoordinatesError para lng < -180", () => {
      expect(() => new GeoLocation({ lat: 0, lng: -180.01 })).toThrow(InvalidCoordinatesError);
    });

    it("lança para lat não numérica", () => {
      expect(() => new GeoLocation({ lat: "a" as unknown as number, lng: 0 })).toThrow(InvalidCoordinatesError);
    });

    it("lança para lng não numérica", () => {
      expect(() => new GeoLocation({ lat: 0, lng: NaN })).toThrow(InvalidCoordinatesError);
    });

    it("lança para lat NaN", () => {
      expect(() => new GeoLocation({ lat: NaN, lng: 0 })).toThrow(InvalidCoordinatesError);
    });
  });

  describe("fromObject", () => {
    it("cria a partir de objeto com lat e lng", () => {
      const g = GeoLocation.fromObject({ lat: -23.5, lng: 46.6 });
      expect(g.lat).toBe(-23.5);
      expect(g.lng).toBe(46.6);
    });

    it("lança quando obj é null", () => {
      expect(() => GeoLocation.fromObject(null)).toThrow(InvalidCoordinatesError);
    });

    it("lança quando obj não tem lat", () => {
      expect(() => GeoLocation.fromObject({ lng: 0 })).toThrow(InvalidCoordinatesError);
    });

    it("lança quando obj não tem lng", () => {
      expect(() => GeoLocation.fromObject({ lat: 0 })).toThrow(InvalidCoordinatesError);
    });

    it("lança quando obj não é object", () => {
      expect(() => GeoLocation.fromObject("x")).toThrow(InvalidCoordinatesError);
    });
  });
});

import { GeoLocation } from "../../../domain/fare/GeoLocation";
import { RequestDateTime } from "../../../domain/fare/RequestDateTime";
import { haversineDistanceKm } from "../../../domain/fare/distance";
import { selectTariffStrategy } from "../../../domain/fare/TariffStrategySelector";

const DEFAULT_TARIFF: Record<string, { base: number; ratePerKm: number }> = {
  day: { base: 5, ratePerKm: 2 },
  night: { base: 7, ratePerKm: 2.5 },
  weekend_day: { base: 6, ratePerKm: 2.2 },
  weekend_night: { base: 8, ratePerKm: 3 },
};

export interface CalculateFareInput {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  datetime: string;
}

export interface CalculateFareResult {
  fare: number;
  distanceKm: number;
  strategy: string;
}

export interface ICalculateFareDeps {
  getDistance?(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number;
  getStrategy?(dt: RequestDateTime): { name: string; calculate: (b: number, r: number, d: number) => number };
  getTariff?(name: string): { base: number; ratePerKm: number };
}

export class CalculateFare {
  constructor(private deps: ICalculateFareDeps = {}) {}

  execute(input: CalculateFareInput): CalculateFareResult {
    const from = GeoLocation.fromObject(input.from);
    const to = GeoLocation.fromObject(input.to);
    const dt = new RequestDateTime(input.datetime);

    const getDistance = this.deps.getDistance ?? haversineDistanceKm;
    const distanceKm = getDistance(from, to);

    const getStrategy = this.deps.getStrategy ?? ((d) => selectTariffStrategy(d));
    const strategy = getStrategy(dt);

    const getTariff = this.deps.getTariff ?? ((name) => DEFAULT_TARIFF[name] ?? DEFAULT_TARIFF.day);
    const { base, ratePerKm } = getTariff(strategy.name);

    const fare = strategy.calculate(base, ratePerKm, distanceKm);

    return {
      fare: Math.round(fare * 100) / 100,
      distanceKm: Math.round(distanceKm * 1000) / 1000,
      strategy: strategy.name,
    };
  }
}

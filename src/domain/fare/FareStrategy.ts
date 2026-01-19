export interface IFareStrategy {
  readonly name: string;
  /** Tarifa = base + ratePerKm * distanceKm. Valores em reais. */
  calculate(base: number, ratePerKm: number, distanceKm: number): number;
}

/**
 * Fórmula padrão: base + (ratePerKm * distanceKm).
 */
export function fareFormula(base: number, ratePerKm: number, distanceKm: number): number {
  return base + ratePerKm * distanceKm;
}

export class DayFare implements IFareStrategy {
  readonly name = "day";
  calculate(base: number, ratePerKm: number, distanceKm: number): number {
    return fareFormula(base, ratePerKm, distanceKm);
  }
}

export class NightFare implements IFareStrategy {
  readonly name = "night";
  calculate(base: number, ratePerKm: number, distanceKm: number): number {
    return fareFormula(base, ratePerKm, distanceKm);
  }
}

export class WeekendDayFare implements IFareStrategy {
  readonly name = "weekend_day";
  calculate(base: number, ratePerKm: number, distanceKm: number): number {
    return fareFormula(base, ratePerKm, distanceKm);
  }
}

export class WeekendNightFare implements IFareStrategy {
  readonly name = "weekend_night";
  calculate(base: number, ratePerKm: number, distanceKm: number): number {
    return fareFormula(base, ratePerKm, distanceKm);
  }
}

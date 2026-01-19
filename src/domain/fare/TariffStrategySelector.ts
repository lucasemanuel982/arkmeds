import { RequestDateTime } from "./RequestDateTime";
import type { IFareStrategy } from "./FareStrategy";
import { DayFare, NightFare, WeekendDayFare, WeekendNightFare } from "./FareStrategy";

/** Dia útil: 06:00–22:00 (360–1320 min). Noturno: 22:00–06:00 (1320–360, cruza meia-noite). */
const DAY_START = 6 * 60;   // 360
const DAY_END = 22 * 60;    // 1320

function isDayPeriod(minutesSinceMidnight: number): boolean {
  return minutesSinceMidnight >= DAY_START && minutesSinceMidnight < DAY_END;
}

const dayFare = new DayFare();
const nightFare = new NightFare();
const weekendDayFare = new WeekendDayFare();
const weekendNightFare = new WeekendNightFare();

export function selectTariffStrategy(dt: RequestDateTime): IFareStrategy {
  const min = dt.getMinutesSinceMidnight();
  const day = isDayPeriod(min);

  if (dt.isWeekend()) {
    return day ? weekendDayFare : weekendNightFare;
  }
  return day ? dayFare : nightFare;
}

export { dayFare, nightFare, weekendDayFare, weekendNightFare };

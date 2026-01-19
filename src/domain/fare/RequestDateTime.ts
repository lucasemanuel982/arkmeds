import { InvalidDateTimeError } from "../../shared/errors/AppError";

function parseOffsetMinutes(iso: string): number {
  if (/Z$/i.test(iso)) return 0;
  const m = /([+-])(\d{2}):(\d{2})$/.exec(iso);
  if (!m) return 0;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
}

/**
 * Data/hora da requisição com timezone (ISO 8601).
 * Ex: "2025-01-15T08:00:00-03:00", "2025-01-15T17:00:00Z"
 * getHours/getMinutes/getDayOfWeek usam o horário local conforme o offset da string.
 */
export class RequestDateTime {
  readonly iso: string;
  readonly date: Date;
  private readonly _offsetMinutes: number;

  constructor(iso: string) {
    if (typeof iso !== "string" || iso.trim() === "") {
      throw new InvalidDateTimeError("Datetime é obrigatório");
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      throw new InvalidDateTimeError("Datetime inválido ou formato incorreto (use ISO 8601 com timezone)");
    }
    this.iso = iso.trim();
    this.date = date;
    this._offsetMinutes = parseOffsetMinutes(this.iso);
  }

  /** 0=domingo, 6=sábado — dia da semana no fuso do datetime. */
  getDayOfWeek(): number {
    const utcMin = this.date.getUTCHours() * 60 + this.date.getUTCMinutes();
    const localMin = utcMin + this._offsetMinutes;
    let dayOffset = 0;
    if (localMin < 0) dayOffset = -1;
    else if (localMin >= 1440) dayOffset = 1;
    const d = new Date(Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate() + dayOffset));
    return d.getUTCDay();
  }

  isWeekend(): boolean {
    const d = this.getDayOfWeek();
    return d === 0 || d === 6;
  }

  /** Hora (0-23) no fuso do datetime. */
  getHours(): number {
    const m = this.getMinutesSinceMidnight();
    return Math.floor(m / 60);
  }

  getMinutes(): number {
    return this.getMinutesSinceMidnight() % 60;
  }

  /** Minutos desde meia-noite no fuso local (0–1439). */
  getMinutesSinceMidnight(): number {
    const utcMin = this.date.getUTCHours() * 60 + this.date.getUTCMinutes();
    const localMin = utcMin + this._offsetMinutes;
    return ((localMin % 1440) + 1440) % 1440;
  }
}

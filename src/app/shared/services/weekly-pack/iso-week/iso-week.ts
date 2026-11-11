export interface IsoWeek {
  year: number;
  week: number;
}

/** Settimana ISO (lunedì-domenica) in cui cade la data, calcolata sull'ora locale */
export function isoWeek(date: Date): IsoWeek {
  const day = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = day.getUTCDay() || 7;
  // Il giovedì della settimana decide a quale anno appartiene
  day.setUTCDate(day.getUTCDate() + 4 - weekday);
  const yearStart = Date.UTC(day.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((day.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return { year: day.getUTCFullYear(), week };
}

/** Giorni da oggi al prossimo lunedì, quando arriva la nuova busta (da 1 a 7) */
export function daysUntilNextWeek(date: Date): number {
  const weekday = date.getDay() || 7;
  return 8 - weekday;
}

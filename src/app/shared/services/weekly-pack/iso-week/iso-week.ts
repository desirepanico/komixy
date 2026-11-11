export interface RomeDate {
  year: number;
  month: number;
  day: number;
}

/** Giorno, mese e anno di `date` nel fuso indicato (non in quello del dispositivo). */
export function dateInZone(date: Date, timeZone: string): RomeDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const value = (type: string): number => Number(parts.find((p) => p.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

/** Giorno della settimana con lunedì = 1 e domenica = 7. */
function isoWeekday(day: RomeDate): number {
  const weekday = new Date(Date.UTC(day.year, day.month - 1, day.day)).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

/** Settimana ISO 8601 (la prima contiene il primo giovedì dell'anno) e anno a cui appartiene. */
export function isoWeek(day: RomeDate): { year: number; week: number } {
  const thursday = new Date(Date.UTC(day.year, day.month - 1, day.day));
  thursday.setUTCDate(thursday.getUTCDate() + 4 - isoWeekday(day));
  const year = thursday.getUTCFullYear();
  const firstDay = Date.UTC(year, 0, 1);
  const week = Math.ceil(((thursday.getTime() - firstDay) / 86_400_000 + 1) / 7);
  return { year, week };
}

/** Giorni che mancano al prossimo lunedì (1 se oggi è domenica, 7 se oggi è lunedì). */
export function daysUntilNextWeek(day: RomeDate): number {
  return 8 - isoWeekday(day);
}

import { describe, expect, it } from 'vitest';
import { daysUntilNextWeek, dateInZone, isoWeek } from './iso-week';

describe('isoWeek', () => {
  it.each([
    [{ year: 2026, month: 11, day: 11 }, { year: 2026, week: 46 }],
    [{ year: 2026, month: 11, day: 9 }, { year: 2026, week: 46 }],
    [{ year: 2026, month: 11, day: 8 }, { year: 2026, week: 45 }],
    [{ year: 2021, month: 1, day: 3 }, { year: 2020, week: 53 }],
    [{ year: 2024, month: 12, day: 30 }, { year: 2025, week: 1 }],
  ])('%j cade nella settimana %j', (giorno, atteso) => {
    expect(isoWeek(giorno)).toEqual(atteso);
  });
});

describe('daysUntilNextWeek', () => {
  it.each([
    [{ year: 2026, month: 11, day: 9 }, 7],
    [{ year: 2026, month: 11, day: 11 }, 5],
    [{ year: 2026, month: 11, day: 15 }, 1],
  ])('da %j mancano %i giorni al lunedì', (giorno, giorni) => {
    expect(daysUntilNextWeek(giorno)).toBe(giorni);
  });
});

describe('dateInZone', () => {
  it('usa il fuso indicato e non quello del dispositivo', () => {
    const quasiMezzanotte = new Date('2026-11-14T23:30:00Z');
    expect(dateInZone(quasiMezzanotte, 'Europe/Rome')).toEqual({ year: 2026, month: 11, day: 15 });
    expect(dateInZone(quasiMezzanotte, 'UTC')).toEqual({ year: 2026, month: 11, day: 14 });
  });
});

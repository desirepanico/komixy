import { describe, expect, it } from 'vitest';
<<<<<<< HEAD
import { daysUntilNextWeek, isoWeek } from './iso-week';

describe('isoWeek', () => {
  it('il 10 novembre 2026 è nella settimana 46', () => {
    expect(isoWeek(new Date(2026, 10, 10))).toEqual({ year: 2026, week: 46 });
  });

  it('il lunedì apre la settimana e la domenica la chiude', () => {
    expect(isoWeek(new Date(2026, 10, 9)).week).toBe(46);
    expect(isoWeek(new Date(2026, 10, 15)).week).toBe(46);
    expect(isoWeek(new Date(2026, 10, 16)).week).toBe(47);
  });

  it("i primi giorni di gennaio possono appartenere all'ultima settimana dell'anno prima", () => {
    expect(isoWeek(new Date(2021, 0, 1))).toEqual({ year: 2020, week: 53 });
  });

  it("gli ultimi giorni di dicembre possono appartenere alla prima settimana dell'anno dopo", () => {
    expect(isoWeek(new Date(2024, 11, 30))).toEqual({ year: 2025, week: 1 });
=======
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});

describe('daysUntilNextWeek', () => {
<<<<<<< HEAD
  it('di lunedì mancano 7 giorni', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 9))).toBe(7);
  });

  it('di mercoledì ne mancano 5', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 11))).toBe(5);
  });

  it('di domenica ne manca 1', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 15))).toBe(1);
=======
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});

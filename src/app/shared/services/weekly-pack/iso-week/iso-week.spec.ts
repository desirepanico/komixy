import { describe, expect, it } from 'vitest';
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
  });
});

describe('daysUntilNextWeek', () => {
  it('di lunedì mancano 7 giorni', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 9))).toBe(7);
  });

  it('di mercoledì ne mancano 5', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 11))).toBe(5);
  });

  it('di domenica ne manca 1', () => {
    expect(daysUntilNextWeek(new Date(2026, 10, 15))).toBe(1);
  });
});

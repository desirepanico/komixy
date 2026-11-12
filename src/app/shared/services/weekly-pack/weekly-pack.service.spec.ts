import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WEEKLY_PACK_STORAGE_KEY } from '../../constants/pack.const';
import { WeeklyPackService } from './weekly-pack.service';

describe('WeeklyPackService', () => {
  const create = () => TestBed.inject(WeeklyPackService);

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-11T10:00:00Z'));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('è la settimana 46 e la prossima busta arriva tra 5 giorni', () => {
    const service = create();
    expect(service.weekNumber).toBe(46);
    expect(service.daysUntilNextPack).toBe(5);
  });

  it('la busta parte sigillata', () => {
    const service = create();
    expect(service.isOpened()).toBe(false);
    expect(service.openedAt()).toBeNull();
    expect(service.openedOnLabel('it')).toBeNull();
  });

  it("dopo l'apertura resta aperta anche ricaricando l'app", () => {
    create().open();
    TestBed.resetTestingModule();
    expect(create().isOpened()).toBe(true);
  });

  it('aprirla di nuovo non cambia la data di apertura', () => {
    const service = create();
    service.open();
    const before = service.openedAt()?.getTime();
    vi.setSystemTime(new Date('2026-11-12T10:00:00Z'));
    service.open();
    expect(service.openedAt()?.getTime()).toBe(before);
  });

  it('una busta aperta la settimana scorsa risulta sigillata', () => {
    localStorage.setItem(
      WEEKLY_PACK_STORAGE_KEY,
      JSON.stringify({ week: '2026-W45', openedAt: '2026-11-04T10:00:00Z' }),
    );
    expect(create().isOpened()).toBe(false);
  });

  it('ignora un contenuto salvato rovinato', () => {
    localStorage.setItem(WEEKLY_PACK_STORAGE_KEY, '{non è json');
    expect(create().isOpened()).toBe(false);
  });

  it('le carte vanno dalla 10ª alla 1ª', () => {
    const ranks = create()
      .deck()
      .map((entry) => entry.rank);
    expect(ranks).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it("sono rare le carte con un'edizione speciale", () => {
    expect(create().rareCount()).toBe(5);
  });

  it('scrive il giorno di apertura in italiano con la maiuscola', () => {
    const service = create();
    service.open();
    expect(service.openedOnLabel('it')).toMatch(/^Mer 11 nov/);
  });
});

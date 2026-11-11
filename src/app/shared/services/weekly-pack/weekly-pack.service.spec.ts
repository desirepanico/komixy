import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WEEKLY_PACK_STORAGE_KEY } from '../../constants/ui.const';
import { WeeklyPackService } from './weekly-pack.service';

describe('WeeklyPackService', () => {
  const crea = () => TestBed.inject(WeeklyPackService);

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-11T10:00:00Z'));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('è la settimana 46 e la prossima busta arriva tra 5 giorni', () => {
    const service = crea();
    expect(service.weekNumber).toBe(46);
    expect(service.daysUntilNextPack).toBe(5);
  });

  it('la busta parte sigillata', () => {
    const service = crea();
    expect(service.isOpened()).toBe(false);
    expect(service.openedAt()).toBeNull();
    expect(service.openedOnLabel('it')).toBeNull();
  });

  it("dopo l'apertura resta aperta anche ricaricando l'app", () => {
    crea().open();
    TestBed.resetTestingModule();
    expect(crea().isOpened()).toBe(true);
  });

  it("aprirla di nuovo non cambia la data di apertura", () => {
    const service = crea();
    service.open();
    const prima = service.openedAt()?.getTime();
    vi.setSystemTime(new Date('2026-11-12T10:00:00Z'));
    service.open();
    expect(service.openedAt()?.getTime()).toBe(prima);
  });

  it('una busta aperta la settimana scorsa risulta sigillata', () => {
    localStorage.setItem(
      WEEKLY_PACK_STORAGE_KEY,
      JSON.stringify({ week: '2026-W45', openedAt: '2026-11-04T10:00:00Z' }),
    );
    expect(crea().isOpened()).toBe(false);
  });

  it('ignora un contenuto salvato rovinato', () => {
    localStorage.setItem(WEEKLY_PACK_STORAGE_KEY, '{non è json');
    expect(crea().isOpened()).toBe(false);
  });

  it('le carte vanno dalla 10ª alla 1ª', () => {
    const ranghi = crea()
      .deck()
      .map((entry) => entry.rank);
    expect(ranghi).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it("sono rare le carte con un'edizione speciale", () => {
    expect(crea().rareCount()).toBe(5);
  });

  it('scrive il giorno di apertura in italiano con la maiuscola', () => {
    const service = crea();
    service.open();
    expect(service.openedOnLabel('it')).toMatch(/^Mer 11 nov/);
  });
});

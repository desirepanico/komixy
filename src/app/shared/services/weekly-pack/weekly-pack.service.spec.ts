import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAKE_API_DELAY_MS } from '../../constants/form.const';
import { WEEKLY_PACK_STORAGE_KEY } from '../../constants/ui.const';
import { UserRole } from '../../models/user-role.model';
import { SessionService } from '../session/session.service';
import { WeeklyPackService } from './weekly-pack.service';

describe('WeeklyPackService', () => {
  let service: WeeklyPackService;
  let session: SessionService;

  const apri = async () => {
    const richiesta = firstValueFrom(service.open());
    await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
    return richiesta;
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date(2026, 10, 11));
    localStorage.clear();
    service = TestBed.inject(WeeklyPackService);
    session = TestBed.inject(SessionService);
    session.start({ id: 'a@b.it', role: UserRole.User });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('parte sigillata, nella settimana 46, con 5 giorni alla prossima busta', () => {
    expect(service.status()).toBe('sealed');
    expect(service.weekNumber).toBe(46);
    expect(service.daysToNextPack).toBe(5);
  });

  it('aprendola restituisce le 10 carte della classifica e diventa aperta', async () => {
    const carte = await apri();
    expect(carte).toHaveLength(10);
    expect(carte[0].rank).toBe(1);
    expect(service.status()).toBe('opened');
  });

  it('riaprirla restituisce le stesse carte senza cambiare lo stato', async () => {
    const prima = await apri();
    const dopo = await apri();
    expect(dopo).toEqual(prima);
    expect(service.status()).toBe('opened');
  });

  it("l'apertura si ricorda anche con un nuovo servizio", async () => {
    await apri();
    TestBed.resetTestingModule();
    const nuovo = TestBed.inject(WeeklyPackService);
    TestBed.inject(SessionService).start({ id: 'a@b.it', role: UserRole.User });
    expect(nuovo.status()).toBe('opened');
  });

  it("la busta aperta da un utente non apre quella di un altro, né dell'ospite", async () => {
    await apri();
    session.start({ id: 'guest', role: UserRole.Guest });
    expect(service.status()).toBe('sealed');
  });

  it("l'ospite può aprire la busta come gli altri", async () => {
    session.start({ id: 'guest', role: UserRole.Guest });
    await apri();
    expect(service.status()).toBe('opened');
  });

  it('un archivio con dati rovinati non rompe il servizio', () => {
    TestBed.resetTestingModule();
    localStorage.setItem(WEEKLY_PACK_STORAGE_KEY, '{non è json');
    expect(TestBed.inject(WeeklyPackService).status()).toBe('sealed');
  });
});

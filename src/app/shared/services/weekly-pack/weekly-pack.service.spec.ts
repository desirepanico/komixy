import { TestBed } from '@angular/core/testing';
<<<<<<< HEAD
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
=======
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
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  });
});

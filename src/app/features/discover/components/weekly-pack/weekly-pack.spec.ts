import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { stubImage } from '@testing/image-stub/image-stub';
import { firstValueFrom, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PackRendererLoader } from '@shared/components/pack-scene/pack-renderer-loader/pack-renderer-loader.service';
import { FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { PackRendererOptions, PackSceneApi } from '@shared/models/pack.model';
import { UserRole } from '@shared/models/user-role.model';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyPack } from './weekly-pack';

describe('WeeklyPack', () => {
  let fixture: ComponentFixture<WeeklyPack>;
  let html: HTMLElement;
  let opzioniScena: PackRendererOptions | null;
  let scenaRifiutata: boolean;

  const caricatoreFinto = {
    create: async (opzioni: PackRendererOptions): Promise<PackSceneApi> => {
      if (scenaRifiutata) throw new Error('niente WebGL');
      opzioniScena = opzioni;
      return {
        start: vi.fn(),
        setCards: vi.fn(),
        tearOpen: vi.fn(),
        flip: vi.fn(),
        next: vi.fn(),
        inspect: vi.fn(),
        closeInspect: vi.fn(),
        dispose: vi.fn(),
      };
    },
  };

  const passa = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    await fixture.whenStable();
  };

  const bottone = (testo: string) =>
    Array.from(html.querySelectorAll('button, a')).find((e) =>
      e.textContent?.includes(testo),
    ) as HTMLElement | undefined;

  const crea = async (
    opzioni: { con3d?: boolean; ruolo?: UserRole; aperta?: boolean } = {},
  ) => {
    TestBed.overrideProvider(PackSupportService, { useValue: { supports3d: opzioni.con3d ?? false } });
    TestBed.inject(SessionService).start({ id: 'utente', role: opzioni.ruolo ?? UserRole.User });
    if (opzioni.aperta) {
      const richiesta = firstValueFrom(TestBed.inject(WeeklyPackService).open());
      await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
      await richiesta;
    }
    fixture = TestBed.createComponent(WeeklyPack);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date(2026, 10, 11));
    localStorage.clear();
    opzioniScena = null;
    scenaRifiutata = false;
    stubImage();
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    });
    await TestBed.configureTestingModule({
      imports: [WeeklyPack],
      providers: [provideRouter([]), { provide: PackRendererLoader, useValue: caricatoreFinto }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('viene creato', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('busta da aprire', () => {
    it('mostra la settimana, il titolo e il pulsante per aprirla', async () => {
      await crea();
      expect(html.textContent).toContain('weeklyManga.title');
      expect(html.textContent).toContain('weeklyPack.week');
      expect(html.textContent).toContain('weeklyPack.sealed.title');
      expect(bottone('weeklyPack.openNow')).toBeDefined();
    });

    it('non mostra la classifica né la busta aperta', async () => {
      await crea();
      expect(html.querySelector('app-comic-rank-card')).toBeNull();
      expect(html.textContent).not.toContain('weeklyPack.opened.title');
    });

    it('un iscritto non vede inviti a iscriversi', async () => {
      await crea();
      expect(html.textContent).not.toContain('weeklyPack.guest.signUp');
    });

    it('un ospite può aprirla e vede l’invito a iscriversi, con il link alla registrazione', async () => {
      await crea({ ruolo: UserRole.Guest });
      expect(html.textContent).toContain('weeklyPack.sealed.titleGuest');
      expect(bottone('weeklyPack.openNow')).toBeDefined();
      expect(bottone('weeklyPack.guest.signUp')?.getAttribute('href')).toBe('/login/register');
    });

    it('senza 3D «salta l’animazione» non c’è e aprire la busta la apre subito', async () => {
      await crea({ con3d: false });
      expect(bottone('weeklyPack.skip')).toBeUndefined();
      bottone('weeklyPack.openNow')!.click();
      await passa(FAKE_API_DELAY_MS);
      expect(html.textContent).toContain('weeklyPack.opened.title');
      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    });

    it('con 3D offre «salta l’animazione», che apre la busta senza la scena', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.skip')!.click();
      await passa(FAKE_API_DELAY_MS);
      expect(html.textContent).toContain('weeklyPack.opened.title');
      expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    });
  });

  describe('apertura con la scena 3D', () => {
    it('apre una finestra a schermo intero con la scena in modalità rito', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.openNow')!.click();
      await fixture.whenStable();
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
      expect(html.querySelector('dialog app-pack-scene')).not.toBeNull();
      await vi.waitFor(() => expect(opzioniScena).not.toBeNull());
      expect(opzioniScena).toMatchObject({ mode: 'open', count: 10 });
    });

    it('la busta resta sigillata finché lo strappo non è completo', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.openNow')!.click();
      await vi.waitFor(() => expect(opzioniScena).not.toBeNull());
      await passa(FAKE_API_DELAY_MS * 2);
      expect(TestBed.inject(WeeklyPackService).status()).toBe('sealed');
    });

    it('a strappo completo chiede l’apertura al server e passa le carte alla scena', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.openNow')!.click();
      await vi.waitFor(() => expect(opzioniScena).not.toBeNull());
      opzioniScena!.onTearComplete();
      await passa(FAKE_API_DELAY_MS);
      expect(TestBed.inject(WeeklyPackService).status()).toBe('opened');
      const scena = html.querySelector('app-pack-scene');
      expect(scena).not.toBeNull();
    });

    it('a fine rito chiude la finestra e va a «rivedi la settimana»', async () => {
      await crea({ con3d: true });
      const router = TestBed.inject(Router);
      vi.spyOn(router, 'navigate').mockResolvedValue(true);
      bottone('weeklyPack.openNow')!.click();
      await fixture.whenStable();
      fixture.componentInstance['onFinished']();
      await fixture.whenStable();
      expect(html.querySelector('dialog app-pack-scene')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking']);
    });

    it('il pulsante di chiusura chiude la finestra', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.openNow')!.click();
      await fixture.whenStable();
      (html.querySelector('dialog button[aria-label="weeklyPack.close"]') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
      expect(html.querySelector('dialog app-pack-scene')).toBeNull();
    });

    it('chiudere la finestra con Esc smonta la scena', async () => {
      await crea({ con3d: true });
      bottone('weeklyPack.openNow')!.click();
      await fixture.whenStable();
      html.querySelector('dialog')!.dispatchEvent(new Event('close'));
      await fixture.whenStable();
      expect(html.querySelector('dialog app-pack-scene')).toBeNull();
    });

    it('se la scena 3D non parte avvisa e apre la busta senza animazione', async () => {
      scenaRifiutata = true;
      await crea({ con3d: true });
      const toast = TestBed.inject(ToastService);
      vi.spyOn(toast, 'warn');
      bottone('weeklyPack.openNow')!.click();
      await fixture.whenStable();
      await vi.waitFor(() => expect(toast.warn).toHaveBeenCalled());
      await passa(FAKE_API_DELAY_MS);
      expect(toast.warn).toHaveBeenCalledWith(
        'weeklyPack.sceneUnavailable.summaryWarn',
        'weeklyPack.sceneUnavailable.detailWarn',
      );
      expect(TestBed.inject(WeeklyPackService).status()).toBe('opened');
      expect(html.querySelector('dialog app-pack-scene')).toBeNull();
    });

    it('se l’apertura fallisce avvisa, chiude la finestra e la busta resta sigillata', async () => {
      await crea({ con3d: true });
      const toast = TestBed.inject(ToastService);
      vi.spyOn(toast, 'error');
      vi.spyOn(TestBed.inject(WeeklyPackService), 'open').mockReturnValue(
        throwError(() => new Error('server')),
      );
      bottone('weeklyPack.openNow')!.click();
      await vi.waitFor(() => expect(opzioniScena).not.toBeNull());
      opzioniScena!.onTearComplete();
      await passa(10);
      expect(toast.error).toHaveBeenCalledWith(
        'weeklyPack.openError.summaryKo',
        'weeklyPack.openError.detailKo',
      );
      expect(html.querySelector('dialog app-pack-scene')).toBeNull();
      expect(TestBed.inject(WeeklyPackService).status()).toBe('sealed');
    });

    it('il segnalibro dalla scena passa dal servizio dei segnalibri, che blocca l’ospite', async () => {
      await crea({ con3d: true, ruolo: UserRole.Guest });
      const toast = TestBed.inject(ToastService);
      vi.spyOn(toast, 'info');
      fixture.componentInstance['toggleBookmark']('w1');
      expect(toast.info).toHaveBeenCalledWith(
        'bookmark.guestLocked.summaryInfo',
        'bookmark.guestLocked.detailInfo',
      );
    });
  });

  describe('busta già aperta', () => {
    it('mostra la striscia con un solo pulsante «rivedi la settimana» verso la classifica', async () => {
      await crea({ aperta: true });
      expect(html.textContent).toContain('weeklyPack.opened.title');
      expect(html.textContent).not.toContain('weeklyPack.sealed.title');
      const rivedi = bottone('weeklyPack.opened.review');
      expect(rivedi?.getAttribute('href')).toBe('/discover/ranking');
    });

    it('dice quanti giorni mancano alla prossima busta (al plurale)', async () => {
      await crea({ aperta: true });
      expect(html.textContent).toContain('weeklyPack.opened.nextPackOther');
    });

    it('di domenica manca un giorno e usa il singolare', async () => {
      vi.setSystemTime(new Date(2026, 10, 15));
      await crea({ aperta: true });
      expect(html.textContent).toContain('weeklyPack.opened.nextPackOne');
    });

    it('un ospite vede la nota che non può salvare nelle liste', async () => {
      await crea({ aperta: true, ruolo: UserRole.Guest });
      expect(html.textContent).toContain('weeklyPack.guest.note');
      expect(bottone('weeklyPack.guest.signUp')?.getAttribute('href')).toBe('/login/register');
    });

    it('un iscritto non vede la nota', async () => {
      await crea({ aperta: true });
      expect(html.textContent).not.toContain('weeklyPack.guest.note');
    });

    it('la busta non si riapre: non c’è più il pulsante di apertura', async () => {
      await crea({ aperta: true, con3d: true });
      expect(bottone('weeklyPack.openNow')).toBeUndefined();
      expect(bottone('weeklyPack.skip')).toBeUndefined();
    });
  });
});

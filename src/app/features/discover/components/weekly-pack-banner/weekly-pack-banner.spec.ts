import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { WeeklyPackBanner } from './weekly-pack-banner';

describe('WeeklyPackBanner', () => {
  let html: HTMLElement;
  let router: Router;
  let fixture: ReturnType<typeof TestBed.createComponent<WeeklyPackBanner>>;

  const crea = async (iscritto: boolean, aperta = false) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
    if (aperta) TestBed.inject(WeeklyPackService).open();
    fixture = TestBed.createComponent(WeeklyPackBanner);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const testo = () => html.textContent ?? '';

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WeeklyPackBanner],
      providers: [provideRouter([])],
    }).compileComponents();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => localStorage.clear());

  it('viene creato', async () => {
    await crea(true);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('busta da aprire', () => {
    it('per un iscritto invita ad aprirla, senza il pulsante Iscriviti', async () => {
      await crea(true);
      expect(testo()).toContain('weeklyPack.readyTitle');
      expect(testo()).toContain('weeklyPack.week');
      expect(testo()).not.toContain('weeklyPack.guestTitle');
      expect(html.querySelector('a[href="/discover/pack"]')?.textContent).toContain(
        'weeklyPack.open',
      );
      expect(html.querySelector('a[href="/login"]')).toBeNull();
    });

    it('per un ospite la apre comunque e propone di iscriversi', async () => {
      await crea(false);
      expect(testo()).toContain('weeklyPack.guestTitle');
      expect(testo()).toContain('weeklyPack.guestWeek');
      expect(html.querySelector('a[href="/discover/pack"]')).not.toBeNull();
      expect(html.querySelector('a[href="/login"]')?.textContent).toContain('weeklyPack.signUp');
    });

    it("«Salta l'animazione» apre la busta e va alla revisione della settimana", async () => {
      await crea(true);
      (html.querySelector('button') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(TestBed.inject(WeeklyPackService).isOpened()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking']);
      expect(testo()).toContain('weeklyPack.openedTitle');
    });
  });

  describe('busta aperta', () => {
    it("mostra la striscia con il solo pulsante «Rivedi la settimana»", async () => {
      await crea(true, true);
      expect(testo()).toContain('weeklyPack.openedTitle');
      expect(testo()).toContain('weeklyPack.nextPackIn');
      expect(html.querySelectorAll('a')).toHaveLength(1);
      const rivedi = html.querySelector('a[href="/discover/ranking"]');
      expect(rivedi?.textContent).toContain('weeklyPack.review');
      expect(html.querySelector('button')).toBeNull();
    });

    it("l'ospite vede anche l'avviso che non può salvare nelle liste", async () => {
      await crea(false, true);
      expect(html.querySelector('app-guest-notice')).not.toBeNull();
    });

    it("l'iscritto non vede l'avviso", async () => {
      await crea(true, true);
      expect(html.querySelector('app-guest-notice')).toBeNull();
    });
  });
});

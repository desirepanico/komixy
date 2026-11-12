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

  const create = async (isMember: boolean, isOpened = false) => {
    TestBed.inject(SessionService).setAuthenticated(isMember);
    if (isOpened) TestBed.inject(WeeklyPackService).open();
    fixture = TestBed.createComponent(WeeklyPackBanner);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const text = () => html.textContent ?? '';

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
    await create(true);
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('busta da aprire', () => {
    it('per un isMember invita ad aprirla, senza il pulsante Iscriviti', async () => {
      await create(true);
      expect(text()).toContain('weeklyPack.readyTitle');
      expect(text()).toContain('weeklyPack.week');
      expect(text()).not.toContain('weeklyPack.guestTitle');
      expect(html.querySelector('a[href="/discover/pack"]')?.textContent).toContain(
        'weeklyPack.open',
      );
      expect(html.querySelector('a[href="/login"]')).toBeNull();
    });

    it('per un ospite la apre comunque e avvisa che non può salvare, con il link per iscriversi', async () => {
      await create(false);
      expect(text()).toContain('weeklyPack.guestTitle');
      expect(text()).toContain('weeklyPack.guestWeek');
      expect(html.querySelector('a[href="/discover/pack"]')).not.toBeNull();
      expect(html.querySelector('app-message')?.textContent).toContain('guestNotice.list');
      expect(html.querySelector('app-message a[href="/login"]')?.textContent).toContain(
        'guestNotice.signUp',
      );
    });

    it('la riga dei pulsanti ha solo «Apri la busta» e «Salta l’animazione»', async () => {
      await create(false);
      expect(html.querySelectorAll('[appButton]')).toHaveLength(2);
    });

    it("«Salta l'animazione» apre la busta e va alla revisione della settimana", async () => {
      await create(true);
      (html.querySelector('button') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(TestBed.inject(WeeklyPackService).isOpened()).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking']);
      expect(text()).toContain('weeklyPack.openedTitle');
    });
  });

  describe('busta isOpened', () => {
    it('mostra la striscia con il solo pulsante «Rivedi la settimana»', async () => {
      await create(true, true);
      expect(text()).toContain('weeklyPack.openedTitle');
      expect(text()).toContain('weeklyPack.nextPackIn');
      expect(html.querySelectorAll('a')).toHaveLength(1);
      const review = html.querySelector('a[href="/discover/ranking"]');
      expect(review?.textContent).toContain('weeklyPack.review');
      expect(html.querySelector('button')).toBeNull();
    });

    it('sotto la data dice quante carte sono rare', async () => {
      await create(true, true);
      expect(text()).toContain('weeklyPack.rareCount');
    });

    it("l'ospite vede anche l'avviso che non può salvare nelle liste", async () => {
      await create(false, true);
      expect(html.querySelector('app-message')).not.toBeNull();
    });

    it("l'isMember non vede l'avviso", async () => {
      await create(true, true);
      expect(html.querySelector('app-message')).toBeNull();
    });
  });
});

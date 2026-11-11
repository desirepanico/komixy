import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PACK_TEAR_ANIMATION_MS, WEEKLY_PACK_STORAGE_KEY } from '@shared/constants/ui.const';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { PackOpeningPage } from './pack-opening-page';

describe('PackOpeningPage', () => {
  let fixture: ComponentFixture<PackOpeningPage>;
  let html: HTMLElement;
  let router: Router;

  const crea = async (iscritto = true) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
    fixture = TestBed.createComponent(PackOpeningPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const principale = () =>
    Array.from(html.querySelectorAll('button')).find((b) => b.classList.contains('min-w-40'))!;
  const contatore = () => html.querySelector('[aria-live]')?.textContent?.trim();

  const strappa = async () => {
    principale().click();
    await vi.advanceTimersByTimeAsync(PACK_TEAR_ANIMATION_MS);
    await fixture.whenStable();
  };
  const apriTutteLeCarte = async () => {
    await strappa();
    for (let i = 0; i < 10; i++) {
      principale().click(); // gira
      await fixture.whenStable();
      principale().click(); // prossima (o raccolta, all'ultima)
      await fixture.whenStable();
    }
  };

  beforeEach(async () => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    await TestBed.configureTestingModule({
      imports: [PackOpeningPage],
      providers: [provideRouter([])],
    }).compileComponents();
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('viene creata', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è la pagina principale del documento, con il titolo h1', async () => {
    await crea();
    expect(html.querySelector('main h1')?.textContent).toContain('weeklyPack.title');
  });

  it('parte con la busta sigillata e il contatore a zero', async () => {
    await crea();
    expect(html.querySelector('app-pack-tear')).not.toBeNull();
    expect(html.textContent).toContain('weeklyPack.tearHint');
    expect(contatore()).toBe('weeklyPack.cardsFlipped');
    expect(TestBed.inject(WeeklyPackService).isOpened()).toBe(false);
  });

  it('per un ospite il sottotitolo lo dice', async () => {
    await crea(false);
    expect(html.querySelector('header p')?.textContent).toContain('weeklyPack.guestSubtitle');
  });

  it("strappata la busta l'apertura si registra e compare la prima carta, la 10ª, col dorso", async () => {
    await crea();
    principale().click();
    await fixture.whenStable();
    expect(TestBed.inject(WeeklyPackService).isOpened()).toBe(true);
    expect(html.querySelector('app-pack-tear')).not.toBeNull();

    await vi.advanceTimersByTimeAsync(PACK_TEAR_ANIMATION_MS);
    await fixture.whenStable();
    expect(html.querySelector('app-pack-tear')).toBeNull();
    expect(html.querySelector('app-card-spotlight')).not.toBeNull();
    expect(html.querySelector('app-pack-card')?.textContent).toContain('10');
    expect(html.textContent).toContain('weeklyPack.tapToFlip');
  });

  it('toccando la carta la gira, poi passa alla successiva: 9ª, con una miniatura', async () => {
    await crea();
    await strappa();
    principale().click();
    await fixture.whenStable();
    expect(html.textContent).toContain('weeklyPack.tapToContinue');
    expect(html.querySelector('a[href="/comic/w10"]')).not.toBeNull();

    principale().click();
    await fixture.whenStable();
    expect(html.querySelector('app-pack-card')?.textContent).toContain('9');
    expect(html.querySelectorAll('ul[afterCard] app-pack-card')).toHaveLength(1);
    expect(html.textContent).toContain('weeklyPack.tapToFlip');
  });

  it('una carta con edizione speciale è annunciata come rara', async () => {
    await crea();
    await strappa();
    principale().click();
    await fixture.whenStable();
    expect(html.textContent).toContain('weeklyPack.rare');
    expect(html.textContent).toContain('mangaCard.editions.variant');
  });

  it("all'ultima carta il bottone porta alla raccolta a ventaglio con tutte le carte girate", async () => {
    await crea();
    await apriTutteLeCarte();
    expect(html.querySelector('app-card-fan')).not.toBeNull();
    expect(html.querySelectorAll('app-card-fan button')).toHaveLength(10);
    expect(html.textContent).toContain('weeklyPack.collectionComplete');
    expect(html.textContent).toContain('weeklyPack.rareCount');
    expect(html.querySelector('a[href="/discover/ranking"]')).not.toBeNull();
  });

  it('dalla raccolta si sceglie una carta e si torna alla raccolta', async () => {
    await crea();
    await apriTutteLeCarte();
    (html.querySelectorAll('app-card-fan button')[0] as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(html.querySelector('app-card-spotlight')).not.toBeNull();
    // il ventaglio resta dietro alla carta scelta, senza essere raggiungibile
    expect(html.querySelector('app-card-spotlight [inert] app-card-fan')).not.toBeNull();
    expect(html.textContent).toContain('#10');
    expect(html.textContent).toContain('weeklyPack.backToCollection');

    principale().click();
    await fixture.whenStable();
    expect(html.querySelector('app-card-spotlight')).toBeNull();
    expect(html.querySelector('app-card-fan')).not.toBeNull();
  });

  it('Esc riporta a Scopri', async () => {
    await crea();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover']);
  });

  it('una busta già aperta non si riapre: porta alla revisione della settimana', async () => {
    localStorage.setItem(
      WEEKLY_PACK_STORAGE_KEY,
      JSON.stringify({ week: '2026-W46', openedAt: '2026-11-10T10:00:00Z' }),
    );
    vi.setSystemTime(new Date('2026-11-11T10:00:00Z'));
    await crea();
    expect(router.navigate).toHaveBeenCalledWith(['/', 'discover', 'ranking']);
    expect(html.querySelector('main')).toBeNull();
  });
});

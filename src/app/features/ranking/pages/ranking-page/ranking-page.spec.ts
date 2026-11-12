import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { RankingPage } from './ranking-page';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<unknown>;
  let component: RankingPage;
  let harness: RouterTestingHarness | undefined;

  const RANKING_URL = '/discover/ranking';

  const create = async (opzioni: { iscritto?: boolean; aperta?: boolean; url?: string } = {}) => {
    TestBed.inject(SessionService).setAuthenticated(opzioni.iscritto ?? true);
    if (opzioni.aperta ?? true) TestBed.inject(WeeklyPackService).open();
    harness ??= await RouterTestingHarness.create();
    component = await harness.navigateByUrl(opzioni.url ?? RANKING_URL, RankingPage);
    fixture = harness.fixture;
    html = harness.routeNativeElement as HTMLElement;
    await fixture.whenStable();
  };
  const item = (n: number) =>
    html.querySelectorAll('app-select-button button')[n] as HTMLButtonElement;
  const openCards = async () => {
    item(1).click();
    await fixture.whenStable();
  };

  // Esce dalla classifica: la pagina si distrugge e rientrando si ricrea
  const leave = async () => {
    await harness?.navigateByUrl('/altrove');
  };

  beforeEach(async () => {
    harness = undefined;
    localStorage.clear();
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'discover/ranking', component: RankingPage },
          { path: 'altrove', children: [] },
        ]),
      ],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await create();
    expect(component).toBeTruthy();
  });

  it('ha un pulsante per tornare a Scopri', async () => {
    await create();
    const back = html.querySelector('a[href="/discover"]');
    expect(back?.getAttribute('aria-label')).toBe('common.back');
  });

  describe('con la busta sigillata', () => {
    beforeEach(() => create({ aperta: false }));

    it('non mostra la classifica ma il blocco, senza il cambio vista', () => {
      expect(html.querySelector('app-ranking-locked')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card')).toBeNull();
      expect(html.querySelector('app-card-fan')).toBeNull();
      expect(html.querySelector('app-select-button')).toBeNull();
      expect(html.querySelector('h1')?.textContent).toContain('ranking.title');
      expect(html.querySelector('p')?.textContent).toContain('ranking.subtitleSealed');
    });

    it("dopo «Salta l'animazione» compare la classifica", async () => {
      (html.querySelector('app-ranking-locked button') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(html.querySelector('app-ranking-locked')).toBeNull();
      expect(html.querySelectorAll('app-comic-rank-card')).toHaveLength(10);
    });
  });

  describe('vista Elenco', () => {
    it('mostra tutta la classifica in ordine', async () => {
      await create();
      const rows = Array.from(html.querySelectorAll('app-comic-rank-card'));
      expect(rows).toHaveLength(10);
      expect(rows[0].textContent).toContain('1');
      expect(item(0).getAttribute('aria-pressed')).toBe('true');
    });

    it('per un ospite avvisa che non può salvare nelle liste', async () => {
      await create({ iscritto: false });
      expect(html.querySelector('app-message')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card app-bookmark-button a')).not.toBeNull();
    });

    it("un iscritto non vede l'avviso e salva più righe in lista", async () => {
      await create();
      expect(html.querySelector('app-message')).toBeNull();
      const bookmarks = () =>
        Array.from(
          html.querySelectorAll('app-comic-rank-card button[aria-pressed]'),
        ) as HTMLButtonElement[];
      bookmarks()[0].click();
      bookmarks()[3].click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);
      expect(bookmarks().map((b) => b.getAttribute('aria-pressed'))).toEqual([
        'true',
        'false',
        'false',
        'true',
        'false',
        'false',
        'false',
        'false',
        'false',
        'false',
      ]);
    });
  });

  describe('vista Carte', () => {
    it("si apre direttamente dall'indirizzo con ?view=cards", async () => {
      await create({ url: `${RANKING_URL}?view=cards` });
      expect(html.querySelector('app-card-fan')).not.toBeNull();
      expect(item(1).getAttribute('aria-pressed')).toBe('true');
    });

    it('mostra il ventaglio', async () => {
      await create();
      await openCards();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card')).toBeNull();
      expect(html.textContent).toContain('common.tapCardHint');
    });

    it("senza parametro nell'indirizzo parte dall'elenco", async () => {
      await create();
      expect(html.querySelector('app-comic-rank-card')).not.toBeNull();
      expect(html.querySelector('app-card-fan')).toBeNull();
    });

    it("con un valore sconosciuto in ?view= parte dall'elenco", async () => {
      await create({ url: `${RANKING_URL}?view=altro` });
      expect(html.querySelector('app-comic-rank-card')).not.toBeNull();
    });

    it("scegliendo le carte mette ?view=cards nell'indirizzo", async () => {
      await create();
      await openCards();
      expect(TestBed.inject(Router).url).toBe(`${RANKING_URL}?view=cards`);
    });

    it("tornando all'elenco mette ?view=list nell'indirizzo", async () => {
      await create({ url: `${RANKING_URL}?view=cards` });
      item(0).click();
      await fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe(`${RANKING_URL}?view=list`);
      expect(html.querySelector('app-comic-rank-card')).not.toBeNull();
    });

    it("rientrando nella classifica senza parametro ritrova l'ultima vista scelta", async () => {
      await create();
      await openCards();

      await leave();
      await create();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
    });

    it("un link con ?view=list vince sull'ultima scelta", async () => {
      await create();
      await openCards();

      await leave();
      await create({ url: `${RANKING_URL}?view=list` });
      expect(html.querySelector('app-comic-rank-card')).not.toBeNull();
    });

    it("un link con ?view=cards diventa anche l'ultima scelta", async () => {
      await create({ url: `${RANKING_URL}?view=cards` });

      await leave();
      await create({ url: RANKING_URL });
      expect(html.querySelector('app-card-fan')).not.toBeNull();
    });

    it('scegliendo una carta la mostra in primo piano, con «Torna alla raccolta»', async () => {
      await create();
      await openCards();
      (html.querySelectorAll('app-card-fan button')[9] as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).not.toBeNull();
      expect(html.textContent).toContain('#1');
      expect(html.querySelector('a[href="/comic/w1"]')?.textContent).toContain(
        'weeklyPack.viewDetail',
      );

      const goBack = Array.from(html.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('weeklyPack.backToCollection'),
      ) as HTMLButtonElement;
      goBack.click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).toBeNull();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
    });

    it('per un ospite «In lista» ha il lucchetto e non salva', async () => {
      await create({ iscritto: false });
      await openCards();
      (html.querySelectorAll('app-card-fan button')[9] as HTMLButtonElement).click();
      await fixture.whenStable();
      const inList = Array.from(html.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('common.inList'),
      ) as HTMLButtonElement;
      inList.click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).savedCount()).toBe(0);
      expect(html.querySelector('a[href="/login"]')?.textContent).toContain('guestNotice.signUp');
    });

    it("tornando all'Elenco la carta scelta non resta aperta", async () => {
      await create();
      await openCards();
      (html.querySelectorAll('app-card-fan button')[0] as HTMLButtonElement).click();
      await fixture.whenStable();
      item(0).click();
      await fixture.whenStable();
      item(1).click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).toBeNull();
    });
  });
});

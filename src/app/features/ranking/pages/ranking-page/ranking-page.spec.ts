import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { RankingPage } from './ranking-page';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<RankingPage>;

  const crea = async (opzioni: { iscritto?: boolean; aperta?: boolean } = {}) => {
    TestBed.inject(SessionService).setAuthenticated(opzioni.iscritto ?? true);
    if (opzioni.aperta ?? true) TestBed.inject(WeeklyPackService).open();
    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
  const voce = (n: number) => html.querySelectorAll('app-select-button button')[n] as HTMLButtonElement;
  const apriCarte = async () => {
    voce(1).click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RankingPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('ha un pulsante per tornare a Scopri', async () => {
    await crea();
    const indietro = html.querySelector('a[href="/discover"]');
    expect(indietro?.getAttribute('aria-label')).toBe('common.back');
  });

  describe('con la busta sigillata', () => {
    beforeEach(() => crea({ aperta: false }));

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
      await crea();
      const righe = Array.from(html.querySelectorAll('app-comic-rank-card'));
      expect(righe).toHaveLength(10);
      expect(righe[0].textContent).toContain('1');
      expect(voce(0).getAttribute('aria-pressed')).toBe('true');
    });

    it("per un ospite avvisa che non può salvare nelle liste", async () => {
      await crea({ iscritto: false });
      expect(html.querySelector('app-message')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card app-bookmark-button a')).not.toBeNull();
    });

    it("un iscritto non vede l'avviso e salva più righe in lista", async () => {
      await crea();
      expect(html.querySelector('app-message')).toBeNull();
      const segnalibri = () =>
        Array.from(html.querySelectorAll('app-comic-rank-card button[aria-pressed]')) as HTMLButtonElement[];
      segnalibri()[0].click();
      segnalibri()[3].click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).savedCount()).toBe(2);
      expect(segnalibri().map((b) => b.getAttribute('aria-pressed'))).toEqual([
        'true', 'false', 'false', 'true', 'false', 'false', 'false', 'false', 'false', 'false',
      ]);
    });
  });

  describe('vista Carte', () => {
    it('mostra il ventaglio e ricorda la vista scelta', async () => {
      await crea();
      await apriCarte();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card')).toBeNull();
      expect(html.textContent).toContain('common.tapCardHint');
      expect(localStorage.getItem(RANKING_VIEW_STORAGE_KEY)).toBe('cards');
    });

    it('riparte dalla vista Carte se era quella scelta', async () => {
      localStorage.setItem(RANKING_VIEW_STORAGE_KEY, 'cards');
      await crea();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
    });

    it('scegliendo una carta la mostra in primo piano, con «Torna alla raccolta»', async () => {
      await crea();
      await apriCarte();
      (html.querySelectorAll('app-card-fan button')[9] as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).not.toBeNull();
      expect(html.textContent).toContain('#1');
      expect(html.querySelector('a[href="/comic/w1"]')?.textContent).toContain('weeklyPack.viewDetail');

      const tornaIndietro = Array.from(html.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('weeklyPack.backToCollection'),
      ) as HTMLButtonElement;
      tornaIndietro.click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).toBeNull();
      expect(html.querySelector('app-card-fan')).not.toBeNull();
    });

    it("per un ospite «In lista» ha il lucchetto e non salva", async () => {
      await crea({ iscritto: false });
      await apriCarte();
      (html.querySelectorAll('app-card-fan button')[9] as HTMLButtonElement).click();
      await fixture.whenStable();
      const inLista = Array.from(html.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('common.inList'),
      ) as HTMLButtonElement;
      inLista.click();
      await fixture.whenStable();
      expect(TestBed.inject(BookmarksService).savedCount()).toBe(0);
      expect(html.querySelector('a[href="/login"]')?.textContent).toContain('bookmark.signUp');
    });

    it('tornando all\'Elenco la carta scelta non resta aperta', async () => {
      await crea();
      await apriCarte();
      (html.querySelectorAll('app-card-fan button')[0] as HTMLButtonElement).click();
      await fixture.whenStable();
      voce(0).click();
      await fixture.whenStable();
      voce(1).click();
      await fixture.whenStable();
      expect(html.querySelector('app-card-spotlight')).toBeNull();
    });
  });
});

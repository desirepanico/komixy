import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
<<<<<<< HEAD
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { PackRendererLoader } from '@shared/components/pack-scene/pack-renderer-loader/pack-renderer-loader.service';
import { PackSceneApi } from '@shared/models/pack.model';
import { UserRole } from '@shared/models/user-role.model';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
=======
import { beforeEach, describe, expect, it } from 'vitest';
import { RANKING_VIEW_STORAGE_KEY } from '@shared/constants/ui.const';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { RankingPage } from './ranking-page';
import { stubImage } from '@testing/image-stub/image-stub';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<RankingPage>;
  const scenaCreata = signal(0);
  let rifiuta = false;

<<<<<<< HEAD
  const caricatoreFinto = {
    create: async (): Promise<PackSceneApi> => {
      if (rifiuta) throw new Error('niente WebGL');
      scenaCreata.update((n) => n + 1);
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

  const apriBusta = async () => {
    const richiesta = firstValueFrom(TestBed.inject(WeeklyPackService).open());
    await vi.advanceTimersByTimeAsync(FAKE_API_DELAY_MS);
    await richiesta;
  };

  const crea = async (opzioni: { aperta?: boolean; con3d?: boolean; ruolo?: UserRole } = {}) => {
    TestBed.overrideProvider(PackSupportService, { useValue: { supports3d: opzioni.con3d ?? false } });
    TestBed.inject(SessionService).start({ id: 'utente', role: opzioni.ruolo ?? UserRole.User });
    if (opzioni.aperta ?? true) await apriBusta();
=======
  const crea = async (opzioni: { iscritto?: boolean; aperta?: boolean } = {}) => {
    TestBed.inject(SessionService).setAuthenticated(opzioni.iscritto ?? true);
    if (opzioni.aperta ?? true) TestBed.inject(WeeklyPackService).open();
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };
<<<<<<< HEAD

  const vista = (nome: string) =>
    Array.from(html.querySelectorAll('[role="group"] button')).find((b) =>
      b.textContent?.includes(nome),
    ) as HTMLButtonElement;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    localStorage.clear();
    rifiuta = false;
    scenaCreata.set(0);
    stubImage();
    await TestBed.configureTestingModule({
      imports: [RankingPage],
      providers: [provideRouter([]), { provide: PackRendererLoader, useValue: caricatoreFinto }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

=======
  const voce = (n: number) => html.querySelectorAll('app-ranking-view-switch button')[n] as HTMLButtonElement;
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

>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  it('viene creata', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

<<<<<<< HEAD
  it('a busta aperta mostra il titolo e tutta la classifica in ordine', async () => {
    await crea();
    expect(html.querySelector('h1')?.textContent).toContain('rankingPage.title');
    const righe = Array.from(html.querySelectorAll('app-comic-rank-card'));
    expect(righe).toHaveLength(10);
    expect(righe[0].textContent).toContain('1');
  });

=======
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  it('ha un pulsante per tornare a Scopri', async () => {
    await crea();
    const indietro = html.querySelector('a[href="/discover"]');
    expect(indietro?.getAttribute('aria-label')).toBe('common.back');
  });

<<<<<<< HEAD
  it('con la busta sigillata non mostra la classifica ma invita ad aprirla', async () => {
    await crea({ aperta: false });
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
    expect(html.querySelector('app-pack-scene')).toBeNull();
    expect(html.textContent).toContain('rankingPage.sealed.title');
    expect(html.querySelectorAll('a[href="/discover"]').length).toBeGreaterThan(1);
  });

  it('con la busta sigillata non offre il cambio vista', async () => {
    await crea({ aperta: false, con3d: true });
    expect(html.querySelector('[role="group"]')).toBeNull();
  });

  it('senza 3D mostra solo l’elenco, senza cambio vista', async () => {
    await crea({ con3d: false });
    expect(html.querySelector('[role="group"]')).toBeNull();
    expect(html.querySelectorAll('app-comic-rank-card')).toHaveLength(10);
  });

  it('con 3D offre elenco e carte, partendo dall’elenco', async () => {
    await crea({ con3d: true });
    expect(vista('rankingPage.view.list').getAttribute('aria-pressed')).toBe('true');
    expect(vista('rankingPage.view.cards').getAttribute('aria-pressed')).toBe('false');
    expect(html.querySelector('app-pack-scene')).toBeNull();
  });

  it('scegliendo «carte» mostra la scena in revisione, con una carta per posizione', async () => {
    await crea({ con3d: true });
    vista('rankingPage.view.cards').click();
    await fixture.whenStable();
    expect(html.querySelector('app-comic-rank-card')).toBeNull();
    expect(html.querySelector('app-pack-scene')).not.toBeNull();
    expect(vista('rankingPage.view.cards').getAttribute('aria-pressed')).toBe('true');
    await vi.waitFor(() => expect(scenaCreata()).toBe(1));
  });

  it('si può tornare all’elenco dalla vista carte', async () => {
    await crea({ con3d: true });
    vista('rankingPage.view.cards').click();
    await fixture.whenStable();
    vista('rankingPage.view.list').click();
    await fixture.whenStable();
    expect(html.querySelectorAll('app-comic-rank-card')).toHaveLength(10);
  });

  it('ricorda la vista scelta', async () => {
    await crea({ con3d: true });
    vista('rankingPage.view.cards').click();
    await fixture.whenStable();
    fixture.destroy();

    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
    expect(html.querySelector('app-pack-scene')).not.toBeNull();
  });

  it('se il 3D non parte torna all’elenco e lo dice', async () => {
    rifiuta = true;
    await crea({ con3d: true });
    const toast = TestBed.inject(ToastService);
    vi.spyOn(toast, 'warn');
    vista('rankingPage.view.cards').click();
    await fixture.whenStable();
    await vi.waitFor(() => expect(toast.warn).toHaveBeenCalled());
    await fixture.whenStable();
    expect(html.querySelectorAll('app-comic-rank-card')).toHaveLength(10);
    expect(toast.warn).toHaveBeenCalledWith(
      'rankingPage.sceneUnavailable.summaryWarn',
      'rankingPage.sceneUnavailable.detailWarn',
    );
  });

  it('un iscritto aggiunge e toglie un fumetto dalla lista dal segnalibro della riga', async () => {
    await crea();
    const primo = () => html.querySelector('button[aria-pressed]') as HTMLButtonElement;
    primo().click();
    await fixture.whenStable();
    expect(primo().getAttribute('aria-pressed')).toBe('true');
=======
  describe('con la busta sigillata', () => {
    beforeEach(() => crea({ aperta: false }));
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7

    it('non mostra la classifica ma il blocco, senza il cambio vista', () => {
      expect(html.querySelector('app-ranking-locked')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card')).toBeNull();
      expect(html.querySelector('app-card-fan')).toBeNull();
      expect(html.querySelector('app-ranking-view-switch')).toBeNull();
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
      expect(html.querySelector('app-guest-notice')).not.toBeNull();
      expect(html.querySelector('app-comic-rank-card app-bookmark-button a')).not.toBeNull();
    });

    it("un iscritto non vede l'avviso e salva più righe in lista", async () => {
      await crea();
      expect(html.querySelector('app-guest-notice')).toBeNull();
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
      expect(html.textContent).toContain('ranking.cardsHint');
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

  it('per l’ospite i segnalibri delle righe hanno il lucchetto e non salvano', async () => {
    await crea({ ruolo: UserRole.Guest });
    const primo = () => html.querySelector('app-comic-rank-card button') as HTMLButtonElement;
    expect(primo().getAttribute('aria-disabled')).toBe('true');
    primo().click();
    await fixture.whenStable();
    expect(primo().getAttribute('aria-pressed')).toBe('false');
  });
});

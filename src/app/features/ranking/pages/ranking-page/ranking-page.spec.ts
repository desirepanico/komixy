import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAKE_API_DELAY_MS } from '@shared/constants/form.const';
import { PackRendererLoader } from '@shared/components/pack-scene/pack-renderer-loader/pack-renderer-loader.service';
import { PackSceneApi } from '@shared/models/pack.model';
import { UserRole } from '@shared/models/user-role.model';
import { PackSupportService } from '@shared/services/pack-support/pack-support.service';
import { SessionService } from '@shared/services/session/session.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { WeeklyPackService } from '@shared/services/weekly-pack/weekly-pack.service';
import { RankingPage } from './ranking-page';
import { stubImage } from '@testing/image-stub/image-stub';

describe('RankingPage', () => {
  let html: HTMLElement;
  let fixture: ComponentFixture<RankingPage>;
  const scenaCreata = signal(0);
  let rifiuta = false;

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
    fixture = TestBed.createComponent(RankingPage);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };

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

  it('viene creata', async () => {
    await crea();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('a busta aperta mostra il titolo e tutta la classifica in ordine', async () => {
    await crea();
    expect(html.querySelector('h1')?.textContent).toContain('rankingPage.title');
    const righe = Array.from(html.querySelectorAll('app-comic-rank-card'));
    expect(righe).toHaveLength(10);
    expect(righe[0].textContent).toContain('1');
  });

  it('ha un pulsante per tornare a Scopri', async () => {
    await crea();
    const indietro = html.querySelector('a[href="/discover"]');
    expect(indietro?.getAttribute('aria-label')).toBe('common.back');
  });

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

    primo().click();
    await fixture.whenStable();
    expect(primo().getAttribute('aria-pressed')).toBe('false');
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

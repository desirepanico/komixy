import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PackCard,
  PackRendererOptions,
  PackSceneApi,
  PackSceneMode,
  PackSceneState,
} from '../../models/pack.model';
import { PackRendererLoader } from './pack-renderer-loader/pack-renderer-loader.service';
import { PackScene } from './pack-scene';
import { stubImage } from '@testing/image-stub/image-stub';
import { provideTranslocoTesting } from '@testing/test-providers/test-providers';

// Si prova il componente, non il 3D: la scena vera è finta e si comanda a mano
class SceneFinta implements PackSceneApi {
  start = vi.fn();
  setCards = vi.fn();
  tearOpen = vi.fn();
  flip = vi.fn();
  next = vi.fn();
  inspect = vi.fn();
  closeInspect = vi.fn();
  dispose = vi.fn();
  constructor(public readonly opzioni: PackRendererOptions) {}
}

const configurazione = { fallisce: false };
let istanza: SceneFinta | null = null;

const caricatoreFinto = {
  create: async (opzioni: PackRendererOptions) => {
    if (configurazione.fallisce) throw new Error('niente WebGL');
    istanza = new SceneFinta(opzioni);
    return istanza;
  },
};

const carta = (rank: number, edizione: 'deluxe' | null = null): PackCard => ({
  rank,
  detailLink: ['/', 'comic', `w${rank}`],
  comic: {
    id: `w${rank}`,
    title: `Titolo ${rank}`,
    author: 'Autore',
    volume: rank,
    totalVolumes: 10,
    isSingleVolume: false,
    editionType: edizione,
    coverUrl: '',
  },
});

const tre = (): PackCard[] => [carta(1), carta(2), carta(3)];

@Component({
  imports: [PackScene],
  template: `
    <app-pack-scene
      [cards]="carte()"
      [count]="3"
      [mode]="modo()"
      [bookmarkedIds]="inLista()"
      [locked]="bloccata()"
      (tearComplete)="strappo()"
      (finished)="finita()"
      (failed)="fallita()"
      (bookmarkToggle)="segnalibro($event)"
    />
  `,
})
class Host {
  readonly carte = signal<readonly PackCard[]>([]);
  readonly modo = signal<PackSceneMode>('open');
  readonly inLista = signal<readonly string[]>([]);
  readonly bloccata = signal(false);
  strappo = vi.fn();
  finita = vi.fn();
  fallita = vi.fn();
  segnalibro = vi.fn();
}

describe('PackScene', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let html: HTMLElement;

  const scena = () => istanza!;
  const stato = async (parziale: Partial<PackSceneState>) => {
    scena().opzioni.onState({
      phase: 'intro',
      revealed: 0,
      focus: null,
      ...parziale,
    });
    await fixture.whenStable();
  };
  const pulsanti = () => Array.from(html.querySelectorAll('button')) as HTMLButtonElement[];
  const principale = () => html.querySelector('div.min-h-11 button') as HTMLButtonElement | null;
  const crea = async (
    modo: PackSceneMode = 'open',
    iniziale: { carte?: readonly PackCard[]; inLista?: readonly string[]; bloccata?: boolean } = {},
  ) => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    host.modo.set(modo);
    host.carte.set(iniziale.carte ?? []);
    host.inLista.set(iniziale.inLista ?? []);
    host.bloccata.set(iniziale.bloccata ?? false);
    html = fixture.nativeElement;
    await fixture.whenStable();
    await vi.waitFor(() => expect(istanza || configurazione.fallisce).toBeTruthy());
    await fixture.whenStable();
  };

  beforeEach(async () => {
    istanza = null;
    configurazione.fallisce = false;
    stubImage();
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([]), { provide: PackRendererLoader, useValue: caricatoreFinto }],
    }).compileComponents();
  });

  it('è escluso dallo swipe tra pagine, così i gesti sulla scena non cambiano pagina', async () => {
    await crea();
    expect(html.querySelector('app-pack-scene')?.hasAttribute('data-no-swipe')).toBe(true);
  });

  it('viene creato con un canvas nascosto agli screen reader', async () => {
    await crea();
    const canvas = html.querySelector('canvas');
    expect(canvas?.getAttribute('aria-hidden')).toBe('true');
  });

  it('crea la scena con modalità e numero di carte e la avvia', async () => {
    await crea('review');
    expect(scena().opzioni).toMatchObject({ mode: 'review', count: 3 });
    expect(scena().start).toHaveBeenCalledOnce();
  });

  it('se la scena non parte lo comunica, così chi la usa offre un’alternativa', async () => {
    configurazione.fallisce = true;
    await crea();
    await vi.waitFor(() => expect(host.fallita).toHaveBeenCalledOnce());
  });

  it('passa le carte alla scena quando arrivano', async () => {
    await crea();
    host.carte.set([carta(1), carta(2), carta(3)]);
    await fixture.whenStable();
    expect(scena().setCards).toHaveBeenCalledWith(host.carte());
  });

  it("passa subito le carte se ci sono già alla creazione", async () => {
    fixture = TestBed.createComponent(Host);
    fixture.componentInstance.carte.set([carta(1), carta(2), carta(3)]);
    html = fixture.nativeElement;
    await fixture.whenStable();
    await vi.waitFor(() => expect(istanza?.setCards).toHaveBeenCalled());
  });

  it('segnala lo strappo completato', async () => {
    await crea();
    scena().opzioni.onTearComplete();
    expect(host.strappo).toHaveBeenCalledOnce();
  });

  it('a busta chiusa mostra il suggerimento e il pulsante che la strappa', async () => {
    await crea();
    await stato({ phase: 'closed' });
    expect(html.textContent).toContain('weeklyPack.hint.tear');
    principale()!.click();
    expect(scena().tearOpen).toHaveBeenCalledOnce();
  });

  it('durante lo strappo non offre azioni', async () => {
    await crea();
    await stato({ phase: 'tearing' });
    expect(principale()).toBeNull();
    expect(html.textContent).toContain('weeklyPack.hint.opening');
  });

  it('nel mazzo il pulsante «gira» resta disattivato finché non arrivano le carte', async () => {
    await crea();
    await stato({ phase: 'deck' });
    expect(principale()?.disabled).toBe(true);
    expect(html.textContent).toContain('weeklyPack.hint.opening');
    host.carte.set([carta(1), carta(2), carta(3)]);
    await fixture.whenStable();
    expect(principale()?.disabled).toBe(false);
    principale()!.click();
    expect(scena().flip).toHaveBeenCalledOnce();
  });

  it('mostra il contatore delle carte girate nel rito', async () => {
    await crea();
    await stato({ phase: 'deck', revealed: 2 });
    expect(html.querySelector('p.absolute')?.textContent).toContain('weeklyPack.counter');
  });

  it('non mostra il contatore in revisione', async () => {
    await crea('review');
    await stato({ phase: 'collection', revealed: 3 });
    expect(html.querySelector('p.absolute')).toBeNull();
  });

  it('con una carta girata mostra dettaglio e «in lista», e «prossima carta»', async () => {
    await crea('open', { carte: tre() });
    await stato({ phase: 'shown', revealed: 0, focus: 1 });
    const dettaglio = html.querySelector('a[href="/comic/w2"]');
    expect(dettaglio?.textContent).toContain('weeklyPack.action.detail');
    expect(principale()?.textContent).toContain('weeklyPack.action.next');
    principale()!.click();
    expect(scena().next).toHaveBeenCalledOnce();
  });

  it("all'ultima carta il pulsante diventa «vedi tutte»", async () => {
    await crea('open', { carte: tre() });
    await stato({ phase: 'shown', revealed: 2, focus: 0 });
    expect(principale()?.textContent).toContain('weeklyPack.action.showAll');
  });

  it('la carta girata è annunciata agli screen reader, perché il canvas è nascosto', async () => {
    await crea('open', { carte: tre() });
    expect(html.querySelector('p.sr-only')?.textContent?.trim()).toBe('');
    await stato({ phase: 'shown', focus: 1 });
    expect(html.querySelector('p.sr-only')?.textContent).toContain('weeklyPack.cardSummary');
  });

  it('l’annuncio non c’è quando nessuna carta è in primo piano', async () => {
    await crea('open', { carte: tre() });
    await stato({ phase: 'deck' });
    expect(html.querySelector('p.sr-only')?.textContent?.trim()).toBe('');
  });

  it('una carta rara ha il suo suggerimento', async () => {
    await crea('open', { carte: [carta(1, 'deluxe'), carta(2), carta(3)] });
    await stato({ phase: 'shown', focus: 0 });
    expect(html.textContent).toContain('weeklyPack.hint.shownRare');
  });

  it('«in lista» emette l’id del fumetto e riflette se è già in lista', async () => {
    await crea('open', { carte: tre(), inLista: ['w2'] });
    await stato({ phase: 'shown', focus: 1 });
    const lista = pulsanti().find((b) => b.textContent?.includes('weeklyPack.action.addToList'))!;
    expect(lista.getAttribute('aria-pressed')).toBe('true');
    lista.click();
    expect(host.segnalibro).toHaveBeenCalledWith('w2');
  });

  it('per l’ospite «in lista» è bloccato ma il tocco emette comunque, così arriva l’invito', async () => {
    await crea('open', { carte: tre(), bloccata: true });
    await stato({ phase: 'shown', focus: 0 });
    const lista = pulsanti().find((b) => b.textContent?.includes('weeklyPack.action.addToList'))!;
    expect(lista.getAttribute('aria-disabled')).toBe('true');
    expect(lista.hasAttribute('aria-pressed')).toBe(false);
    expect(lista.querySelector('ng-icon')).not.toBeNull();
    lista.click();
    expect(host.segnalibro).toHaveBeenCalledWith('w1');
  });

  it('nella raccolta del rito il pulsante finale comunica che l’utente ha finito', async () => {
    await crea('open', { carte: tre() });
    await stato({ phase: 'collection', revealed: 3 });
    principale()!.click();
    expect(host.finita).toHaveBeenCalledOnce();
  });

  it('nella raccolta c’è un selettore con una carta per posizione, raggiungibile da tastiera', async () => {
    await crea('review', { carte: tre() });
    await stato({ phase: 'collection', revealed: 3 });
    const scelte = Array.from(html.querySelectorAll('ul button')) as HTMLButtonElement[];
    expect(scelte).toHaveLength(3);
    expect(scelte[1].getAttribute('aria-label')).toBe('weeklyPack.cardLabel');
    scelte[1].click();
    expect(scena().inspect).toHaveBeenCalledWith(1);
  });

  it('in revisione la raccolta non ha un pulsante finale', async () => {
    await crea('review', { carte: tre() });
    await stato({ phase: 'collection', revealed: 3 });
    expect(principale()).toBeNull();
  });

  it('con una carta scelta mostra le azioni e un pulsante per tornare alla raccolta', async () => {
    await crea('review', { carte: tre() });
    await stato({ phase: 'inspecting', revealed: 3, focus: 2 });
    expect(html.querySelector('a[href="/comic/w3"]')).not.toBeNull();
    expect(html.querySelector('ul')).toBeNull();
    principale()!.click();
    expect(scena().closeInspect).toHaveBeenCalledOnce();
  });

  it('smaltito, libera la scena', async () => {
    await crea();
    const istanza = scena();
    fixture.destroy();
    expect(istanza.dispose).toHaveBeenCalledOnce();
  });
});

describe('PackScene · annuncio della carta con traduzioni vere', () => {
  it('dice posizione, titolo, autore, volume ed edizione', async () => {
    stubImage();
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [
        provideRouter([]),
        { provide: PackRendererLoader, useValue: caricatoreFinto },
        ...provideTranslocoTesting({
          it: {
            weeklyPack: { cardSummary: 'Carta {{ rank }}: {{ title }}, di {{ author }}. {{ details }}.' },
            mangaCard: {
              volumeLabel: 'Vol.',
              singleVolume: 'Volume Unico',
              editions: { variant: 'Cover variant', deluxe: 'Deluxe', limited: 'Limitata' },
            },
          },
        }),
      ],
    }).compileComponents();
    await firstValueFrom(TestBed.inject(TranslocoService).load('it'));
    istanza = null;
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.carte.set([carta(1, 'deluxe'), carta(2), carta(3)]);
    await fixture.whenStable();
    await vi.waitFor(() => expect(istanza).not.toBeNull());
    istanza!.opzioni.onState({ phase: 'shown', revealed: 0, focus: 0 });
    await fixture.whenStable();
    const annuncio = (fixture.nativeElement as HTMLElement).querySelector('p.sr-only');
    expect(annuncio?.textContent).toBe('Carta 1: Titolo 1, di Autore. Vol. 1, Deluxe.');
  });
});

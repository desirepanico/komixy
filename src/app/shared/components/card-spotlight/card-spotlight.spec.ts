import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingEntry } from '../../models/ranking-entry.model';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { CardSpotlight } from './card-spotlight';

const card = (id: string, rank: number): RankingEntry => ({
  rank,
  comic: {
    id,
    title: `Titolo ${rank}`,
    author: 'Autore',
    volume: rank,
    totalVolumes: 10,
    isSingleVolume: false,
    editionType: null,
    coverUrl: '/img/covers/one-piece.webp',
  },
});

@Component({
  imports: [CardSpotlight],
  template: `
    <app-card-spotlight
      [entry]="card()"
      [detailLink]="['/', 'comic', card().comic.id]"
      [faceUp]="faceUp()"
      [interactive]="interactive()"
      [summary]="summary()"
      (cardPress)="premuta()"
    >
      <span caption>didascalia</span>
      <button id="principale" type="button">Avanti</button>
    </app-card-spotlight>
  `,
})
class Host {
  readonly card = signal(card('w4', 4));
  readonly faceUp = signal(true);
  readonly interactive = signal(false);
  readonly summary = signal(false);
  premuta = vi.fn();
}

describe('CardSpotlight', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const inList = () =>
    Array.from(html.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('common.inList'),
    ) as HTMLButtonElement;

  const create = async (iscritto: boolean) => {
    TestBed.inject(SessionService).setAuthenticated(iscritto);
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    await create(true);
    expect(host()).toBeTruthy();
  });

  it('mostra la carta, la didascalia e il bottone principale passati come contenuto', async () => {
    await create(true);
    expect(html.querySelector('app-pack-card')).not.toBeNull();
    expect(html.textContent).toContain('didascalia');
    expect(html.querySelector('#principale')).not.toBeNull();
  });

  it('«Vedi dettaglio» porta alla pagina del fumetto', async () => {
    await create(true);
    const link = html.querySelector('a[href="/comic/w4"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('weeklyPack.viewDetail');
  });

  it('un iscritto mette e toglie la carta dalla lista', async () => {
    await create(true);
    expect(inList().getAttribute('aria-pressed')).toBe('false');
    inList().click();
    await fixture.whenStable();
    expect(inList().getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(BookmarksService).isSaved('w4')).toBe(true);
  });

  it("un ospite vede il lucchetto e, toccando, l'invito a iscriversi", async () => {
    await create(false);
    expect(html.querySelector('a[href="/login"]')).toBeNull();
    inList().click();
    await fixture.whenStable();
    expect(html.querySelector('a[href="/login"]')?.textContent).toContain('bookmark.signUp');
    expect(TestBed.inject(BookmarksService).isSaved('w4')).toBe(false);
  });

  it("cambiando carta l'invito sparisce", async () => {
    await create(false);
    inList().click();
    await fixture.whenStable();
    host().card.set(card('w3', 3));
    await fixture.whenStable();
    expect(html.querySelector('a[href="/login"]')).toBeNull();
  });

  it('col dorso in vista i comandi restano nascosti', async () => {
    await create(true);
    host().faceUp.set(false);
    await fixture.whenStable();
    expect(html.querySelector('a[href="/comic/w4"]')).toBeNull();
    expect(inList()).toBeUndefined();
  });

  it('se la carta è interattiva è un bottone che gira o avanza', async () => {
    await create(true);
    host().interactive.set(true);
    host().faceUp.set(false);
    await fixture.whenStable();
    const button = html.querySelector('button[aria-label]') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('weeklyPack.flipCard');
    button.click();
    expect(host().premuta).toHaveBeenCalledOnce();

    host().faceUp.set(true);
    await fixture.whenStable();
    expect(html.querySelector('button[aria-label]')?.getAttribute('aria-label')).toBe(
      'weeklyPack.nextCard',
    );
  });

  it('col riepilogo scrive posizione, titolo e volume al posto della didascalia', async () => {
    await create(true);
    host().summary.set(true);
    await fixture.whenStable();
    expect(html.textContent).toContain('#4');
    expect(html.textContent).toContain('Titolo 4');
    expect(html.textContent).toContain('mangaCard.volume');
    expect(html.textContent).not.toContain('didascalia');
  });

  it('se la carta non è interattiva non è un bottone', async () => {
    await create(true);
    expect(html.querySelector('button[aria-label]')).toBeNull();
  });

  it('passando alla carta successiva la carta girevole nasce nuova, già di spalle e senza girare', async () => {
    await create(true);
    host().interactive.set(true);
    host().faceUp.set(true);
    await fixture.whenStable();
    const button = html.querySelector('app-card-spotlight button[aria-label]') as HTMLElement;
    const before = html.querySelector('app-card-spotlight app-pack-card');

    host().card.set(card('w3', 3));
    host().faceUp.set(false);
    await fixture.whenStable();
    const after = html.querySelector('app-card-spotlight app-pack-card');
    expect(after).not.toBe(before);
    expect(html.querySelector('app-card-spotlight button[aria-label]')).toBe(button);
    expect(after?.querySelector('.rotate-y-180.size-full')).not.toBeNull();
  });

  it('rimpicciolisce la carta se lo spazio non basta, senza scendere sotto la scala minima', async () => {
    let height = 300;
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => height);
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private readonly callback: () => void) {}
        observe(): void {
          this.callback();
        }
        disconnect(): void {}
      },
    );
    const fresh = TestBed.createComponent(Host);
    await fresh.whenStable();
    const card = fresh.nativeElement.querySelector('app-pack-card') as HTMLElement;
    // 300 px di spazio meno i 20 di distanza: 280 / 320
    expect(card.style.height).toBe('280px');

    height = 100;
    const small = TestBed.createComponent(Host);
    await small.whenStable();
    const minima = small.nativeElement.querySelector('app-pack-card') as HTMLElement;
    expect(minima.style.height).toBe('160px');
  });
});

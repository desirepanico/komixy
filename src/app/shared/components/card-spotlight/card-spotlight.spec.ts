import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingEntry } from '../../models/ranking-entry.model';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { SessionService } from '../../services/session/session.service';
import { CardSpotlight } from './card-spotlight';

const carta = (id: string, rank: number): RankingEntry => ({
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
      [entry]="carta()"
      [detailLink]="['/', 'comic', carta().comic.id]"
      [faceUp]="davanti()"
      [interactive]="interattiva()"
      [summary]="riepilogo()"
      (cardPress)="premuta()"
    >
      <span caption>didascalia</span>
      <button id="principale" type="button">Avanti</button>
    </app-card-spotlight>
  `,
})
class Host {
  readonly carta = signal(carta('w4', 4));
  readonly davanti = signal(true);
  readonly interattiva = signal(false);
  readonly riepilogo = signal(false);
  premuta = vi.fn();
}

describe('CardSpotlight', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<Host>>;
  let html: HTMLElement;
  const host = () => fixture.componentInstance;
  const inLista = () =>
    Array.from(html.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('common.inList'),
    ) as HTMLButtonElement;

  const crea = async (iscritto: boolean) => {
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
    await crea(true);
    expect(host()).toBeTruthy();
  });

  it('mostra la carta, la didascalia e il bottone principale passati come contenuto', async () => {
    await crea(true);
    expect(html.querySelector('app-pack-card')).not.toBeNull();
    expect(html.textContent).toContain('didascalia');
    expect(html.querySelector('#principale')).not.toBeNull();
  });

  it('«Vedi dettaglio» porta alla pagina del fumetto', async () => {
    await crea(true);
    const link = html.querySelector('a[href="/comic/w4"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('weeklyPack.viewDetail');
  });

  it('un iscritto mette e toglie la carta dalla lista', async () => {
    await crea(true);
    expect(inLista().getAttribute('aria-pressed')).toBe('false');
    inLista().click();
    await fixture.whenStable();
    expect(inLista().getAttribute('aria-pressed')).toBe('true');
    expect(TestBed.inject(BookmarksService).isSaved('w4')).toBe(true);
  });

  it('un ospite vede il lucchetto e, toccando, l\'invito a iscriversi', async () => {
    await crea(false);
    expect(html.querySelector('a[href="/login"]')).toBeNull();
    inLista().click();
    await fixture.whenStable();
    expect(html.querySelector('a[href="/login"]')?.textContent).toContain('bookmark.signUp');
    expect(TestBed.inject(BookmarksService).isSaved('w4')).toBe(false);
  });

  it('cambiando carta l\'invito sparisce', async () => {
    await crea(false);
    inLista().click();
    await fixture.whenStable();
    host().carta.set(carta('w3', 3));
    await fixture.whenStable();
    expect(html.querySelector('a[href="/login"]')).toBeNull();
  });

  it('col dorso in vista i comandi restano nascosti', async () => {
    await crea(true);
    host().davanti.set(false);
    await fixture.whenStable();
    expect(html.querySelector('a[href="/comic/w4"]')).toBeNull();
    expect(inLista()).toBeUndefined();
  });

  it('se la carta è interattiva è un bottone che gira o avanza', async () => {
    await crea(true);
    host().interattiva.set(true);
    host().davanti.set(false);
    await fixture.whenStable();
    const bottone = html.querySelector('button[aria-label]') as HTMLButtonElement;
    expect(bottone.getAttribute('aria-label')).toBe('weeklyPack.flipCard');
    bottone.click();
    expect(host().premuta).toHaveBeenCalledOnce();

    host().davanti.set(true);
    await fixture.whenStable();
    expect(html.querySelector('button[aria-label]')?.getAttribute('aria-label')).toBe(
      'weeklyPack.nextCard',
    );
  });

  it('col riepilogo scrive posizione, titolo e volume al posto della didascalia', async () => {
    await crea(true);
    host().riepilogo.set(true);
    await fixture.whenStable();
    expect(html.textContent).toContain('#4');
    expect(html.textContent).toContain('Titolo 4');
    expect(html.textContent).toContain('mangaCard.volume');
    expect(html.textContent).not.toContain('didascalia');
  });

  it('se la carta non è interattiva non è un bottone', async () => {
    await crea(true);
    expect(html.querySelector('button[aria-label]')).toBeNull();
  });

  it('passando alla carta successiva la carta girevole nasce nuova, già di spalle e senza girare', async () => {
    await crea(true);
    host().interattiva.set(true);
    host().davanti.set(true);
    await fixture.whenStable();
    const bottone = html.querySelector('app-card-spotlight button[aria-label]') as HTMLElement;
    const prima = html.querySelector('app-card-spotlight app-pack-card');

    host().carta.set(carta('w3', 3));
    host().davanti.set(false);
    await fixture.whenStable();
    const dopo = html.querySelector('app-card-spotlight app-pack-card');
    expect(dopo).not.toBe(prima);
    expect(html.querySelector('app-card-spotlight button[aria-label]')).toBe(bottone);
    expect(dopo?.querySelector('.rotate-y-180.size-full')).not.toBeNull();
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicItem } from '@shared/models/comic.model';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { SessionService } from '@shared/services/session/session.service';
import { ComicRankCard } from './comic-rank-card';

const fumetto: ComicItem = {
  id: 'w1',
  title: 'Neon Horizon',
  author: 'C. Arisato',
  volume: 5,
  totalVolumes: 12,
  isSingleVolume: false,
  editionType: 'limited',
  coverUrl: 'https://esempio.it/cover.jpg',
};

@Component({
  imports: [ComicRankCard],
  template: `<app-comic-rank-card
    [comic]="fumetto()"
    [rank]="posizione()"
    [priority]="priorita()"
<<<<<<< HEAD
    [bookmarked]="inLista()"
    [locked]="bloccata()"
    (bookmarkToggle)="toggle()"
=======
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
  />`,
})
class Host {
  readonly fumetto = signal(fumetto);
  readonly posizione = signal(1);
  readonly priorita = signal(false);
<<<<<<< HEAD
  readonly inLista = signal(false);
  readonly bloccata = signal(false);
  toggle = vi.fn();
=======
>>>>>>> 3e90d81c37a4f84b5b06781035b44042b00ce3a7
}

describe('ComicRankCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  };

  it('viene creata', async () => {
    expect((await crea()).fixture.componentInstance).toBeTruthy();
  });

  it('mostra lo skeleton finché la copertina non è caricata', async () => {
    const { fixture, html } = await crea();
    expect(html.querySelector('app-skeleton')).not.toBeNull();
    html.querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(html.querySelector('app-skeleton')).toBeNull();
  });

  it('di default la copertina si carica in lazy', async () => {
    const { html } = await crea();
    const img = html.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.getAttribute('fetchpriority')).toBe('auto');
  });

  it('con priorità la copertina è eager, e solo la prima ha fetchpriority alta', async () => {
    const { fixture, html } = await crea();
    fixture.componentInstance.priorita.set(true);
    await fixture.whenStable();
    expect(html.querySelector('img')?.getAttribute('loading')).toBe('eager');
    expect(html.querySelector('img')?.getAttribute('fetchpriority')).toBe('high');
    fixture.componentInstance.posizione.set(2);
    await fixture.whenStable();
    expect(html.querySelector('img')?.getAttribute('fetchpriority')).toBe('auto');
  });

  it('mostra la posizione, anche come testo per i lettori di schermo', async () => {
    const { html } = await crea();
    expect(html.querySelector('[aria-hidden="true"]')?.textContent).toContain('1');
    expect(html.querySelector('.sr-only')?.textContent).toBe('weeklyManga.rank');
  });

  it('mostra titolo, autore e tag dell’edizione, con il titolo che porta al fumetto', async () => {
    const { html } = await crea();
    const link = html.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Neon Horizon');
    expect(link.getAttribute('href')).toBe('/comic/w1');
    expect(html.textContent).toContain('C. Arisato');
    expect(html.querySelector('app-tag')?.textContent).toContain('mangaCard.editions.limited');
  });

  it('mostra l’etichetta tradotta del volume con il numero e il totale', async () => {
    const { html } = await crea();
    expect(html.textContent).toContain('mangaCard.volumeLabel');
    expect(html.textContent).toContain('/ 12');
  });

  it('il podio (1-3) ha lo stile viola, dal quarto in poi è neutro', async () => {
    const { fixture, html } = await crea();
    const numero = () => html.querySelector('span.tabular-nums') as HTMLElement;
    expect(numero().classList).toContain('from-primary-200');

    fixture.componentInstance.posizione.set(4);
    await fixture.whenStable();
    expect(numero().classList).toContain('from-surface-200');
  });

  it('ritarda l’entrata di 140ms per posizione, a gruppi di 5', async () => {
    const { fixture, html } = await crea();
    const ritardo = () => (html.querySelector('[appInView]') as HTMLElement).style.animationDelay;
    expect(ritardo()).toBe('0ms');

    fixture.componentInstance.posizione.set(3);
    await fixture.whenStable();
    expect(ritardo()).toBe('280ms');

    fixture.componentInstance.posizione.set(6);
    await fixture.whenStable();
    expect(ritardo()).toBe('0ms');
  });

  it('il segnalibro di un iscritto mette il fumetto in lista', async () => {
    TestBed.inject(SessionService).setAuthenticated(true);
    const { fixture, html } = await crea();
    (html.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(TestBed.inject(BookmarksService).isSaved('w1')).toBe(true);
  });

  it('per un ospite il segnalibro ha il lucchetto e porta a iscriversi', async () => {
    const { html } = await crea();
    expect(html.querySelector('button')).toBeNull();
    expect(html.querySelector('app-bookmark-button a')?.getAttribute('href')).toBe('/login');
  });

  it('il segnalibro è premuto quando il fumetto è in lista', async () => {
    const { fixture, html } = await crea();
    fixture.componentInstance.inLista.set(true);
    await fixture.whenStable();
    const segnalibro = html.querySelector('button') as HTMLButtonElement;
    expect(segnalibro.getAttribute('aria-pressed')).toBe('true');
    expect(segnalibro.getAttribute('aria-label')).toBe('bookmark.remove');
  });

  it('per l’ospite il segnalibro ha il lucchetto e non risulta premuto', async () => {
    const { fixture, html } = await crea();
    fixture.componentInstance.inLista.set(true);
    fixture.componentInstance.bloccata.set(true);
    await fixture.whenStable();
    const segnalibro = html.querySelector('button') as HTMLButtonElement;
    expect(segnalibro.getAttribute('aria-label')).toBe('bookmark.locked');
    expect(segnalibro.getAttribute('aria-pressed')).toBe('false');
    expect(segnalibro.getAttribute('aria-disabled')).toBe('true');
  });

  it('per l’ospite il tocco sul segnalibro emette comunque, così arriva l’invito a iscriversi', async () => {
    const { fixture, html } = await crea();
    fixture.componentInstance.bloccata.set(true);
    await fixture.whenStable();
    (html.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.toggle).toHaveBeenCalledOnce();
  });
});

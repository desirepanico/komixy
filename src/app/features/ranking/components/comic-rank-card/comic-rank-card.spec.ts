import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComicItem } from '@shared/models/comic.model';
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
    (bookmarkToggle)="toggle()"
  />`,
})
class Host {
  readonly fumetto = signal(fumetto);
  readonly posizione = signal(1);
  toggle = vi.fn();
}

describe('ComicRankCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  const crea = async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  };

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

  it('il segnalibro emette bookmarkToggle', async () => {
    const { fixture, html } = await crea();
    (html.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.toggle).toHaveBeenCalledOnce();
  });
});

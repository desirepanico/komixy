import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicItem, EditionType } from '../../models/comic.model';
import { ComicCard } from './comic-card';

const comic: ComicItem = {
  id: '7',
  title: 'Neon Horizon',
  author: 'C. Arisato',
  volume: 4,
  totalVolumes: 12,
  isSingleVolume: false,
  editionType: null,
  coverUrl: '/img/neon.webp',
};

@Component({
  imports: [ComicCard],
  template: `
    <app-comic-card [comic]="comic()" [link]="link()">
      <button cardAction type="button">azione</button>
    </app-comic-card>
  `,
})
class Host {
  readonly comic = signal<ComicItem>(comic);
  readonly link = signal<readonly string[] | null>(['/', 'comic', '7']);
}

describe('ComicCard', () => {
  const create = async (
    settings: { single?: boolean; edition?: EditionType | null; link?: string[] | null } = {},
  ) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.comic.set({
      ...comic,
      isSingleVolume: settings.single ?? false,
      editionType: settings.edition ?? null,
    });
    fixture.componentInstance.link.set(
      settings.link === undefined ? ['/', 'comic', '7'] : settings.link,
    );
    await fixture.whenStable();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('viene creata', async () => {
    expect((await create()).fixture.componentInstance).toBeTruthy();
  });

  it('mostra titolo e autore, con il titolo che porta alla pagina del fumetto', async () => {
    const { html } = await create();
    const link = html.querySelector('h3 a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Neon Horizon');
    expect(link.getAttribute('href')).toBe('/comic/7');
    expect(html.textContent).toContain('C. Arisato');
  });

  it('senza link il titolo è solo testo', async () => {
    const { html } = await create({ link: null });
    expect(html.querySelector('a')).toBeNull();
    expect(html.querySelector('h3')?.textContent).toContain('Neon Horizon');
  });

  it('la copertina ha un testo alternativo tradotto', async () => {
    const { html } = await create();
    expect(html.querySelector('img')?.getAttribute('alt')).toBe('mangaCard.coverAlt');
  });

  it('mostra lo skeleton finché la copertina non è caricata, anche se non arriva', async () => {
    const { fixture, html } = await create();
    expect(html.querySelector('app-skeleton')).not.toBeNull();
    html.querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(html.querySelector('app-skeleton')).toBeNull();
  });

  it('mostra volume e totale dei volumi', async () => {
    const { html } = await create();
    expect(html.textContent).toContain('mangaCard.volumeLabel');
    expect(html.textContent).toContain('4');
    expect(html.textContent).toContain('/ 12');
  });

  it('per un volume unico mostra la dicitura tradotta invece del numero', async () => {
    const { html } = await create({ single: true });
    expect(html.textContent).toContain('mangaCard.singleVolume');
    expect(html.textContent).not.toContain('/ 12');
  });

  it("non mostra il tag né la cornice luminosa se non c'è un'edizione speciale", async () => {
    const { html } = await create();
    expect(html.querySelector('app-tag')).toBeNull();
    expect(html.querySelector('app-comic-card > div')?.className).not.toContain(
      'shadow-primary-400/40',
    );
  });

  it("con un'edizione speciale mostra il tag e la cornice luminosa", async () => {
    const { html } = await create({ edition: 'limited' });
    expect(html.querySelector('app-tag')?.textContent).toContain('mangaCard.editions.limited');
    expect(html.querySelector('app-comic-card > div')?.className).toContain(
      'shadow-primary-400/40',
    );
  });

  it("ospita nello spazio in alto a destra l'azione passata da chi la usa", async () => {
    const { html } = await create();
    expect(html.querySelector('app-comic-card img + div button')?.textContent).toContain('azione');
  });

  it('da tastiera si raggiunge solo il link, senza tabindex che lo escluda', async () => {
    const { html } = await create();
    const link = html.querySelector('h3 a') as HTMLAnchorElement;
    expect(link.hasAttribute('tabindex')).toBe(false);
    link.focus();
    expect(document.activeElement).toBe(link);
  });
});

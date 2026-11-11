import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { SessionService } from '@shared/services/session/session.service';
import { BookmarksService } from '@shared/services/bookmarks/bookmarks.service';
import { EditionType } from '@shared/models/comic.model';
import { ComicCard } from './comic-card';

@Component({
  imports: [ComicCard],
  template: `
    <app-comic-card
      id="7"
      title="Neon Horizon"
      author="C. Arisato"
      [volume]="4"
      [totalVolumes]="12"
      [isSingleVolume]="unico()"
      [editionType]="edizione()"
    />
  `,
})
class Host {
  readonly unico = signal(false);
  readonly edizione = signal<EditionType | null>(null);
}

describe('ComicCard', () => {
  const crea = async (impostazioni: { unico?: boolean; edizione?: EditionType | null } = {}) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.unico.set(impostazioni.unico ?? false);
    fixture.componentInstance.edizione.set(impostazioni.edizione ?? null);
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
    expect((await crea()).fixture.componentInstance).toBeTruthy();
  });

  it('mostra titolo e autore, con il titolo che porta alla pagina del fumetto', async () => {
    const { html } = await crea();
    const link = html.querySelector('h3 a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Neon Horizon');
    expect(link.getAttribute('href')).toBe('/comic/7');
    expect(html.textContent).toContain('C. Arisato');
  });

  it('mostra lo skeleton finché la copertina non è caricata', async () => {
    const { fixture, html } = await crea();
    expect(html.querySelector('app-skeleton')).not.toBeNull();
    html.querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();
    expect(html.querySelector('app-skeleton')).toBeNull();
  });

  it('mostra volume e totale dei volumi', async () => {
    const { html } = await crea();
    expect(html.textContent).toContain('mangaCard.volumeLabel');
    expect(html.textContent).toContain('4');
    expect(html.textContent).toContain('/ 12');
  });

  it('per un volume unico mostra la dicitura tradotta invece del numero', async () => {
    const { html } = await crea({ unico: true });
    expect(html.textContent).toContain('mangaCard.singleVolume');
    expect(html.textContent).not.toContain('/ 12');
  });

  it("non mostra il tag se non c'è un'edizione speciale", async () => {
    expect((await crea()).html.querySelector('app-tag')).toBeNull();
  });

  it("mostra il tag dell'edizione quando c'è", async () => {
    const { html } = await crea({ edizione: 'limited' });
    expect(html.querySelector('app-tag')?.textContent).toContain('mangaCard.editions.limited');
  });

  it('il segnalibro mette il fumetto in lista, senza far seguire il link', async () => {
    TestBed.inject(SessionService).setAuthenticated(true);
    const { fixture, html } = await crea();
    const evento = new MouseEvent('click', { bubbles: true, cancelable: true });
    (html.querySelector('button') as HTMLButtonElement).dispatchEvent(evento);
    await fixture.whenStable();

    expect(TestBed.inject(BookmarksService).isSaved('7')).toBe(true);
    expect(html.querySelector('button')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('per un ospite il segnalibro ha il lucchetto e porta a iscriversi', async () => {
    const { html } = await crea();
    expect(html.querySelector('button')).toBeNull();
    expect(html.querySelector('app-bookmark-button a')?.getAttribute('href')).toBe('/login');
  });
});

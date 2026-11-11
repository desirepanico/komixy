import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
      [bookmarked]="inLista()"
      [locked]="bloccata()"
      (bookmarkToggle)="toggle()"
    />
  `,
})
class Host {
  readonly unico = signal(false);
  readonly edizione = signal<EditionType | null>(null);
  readonly inLista = signal(false);
  readonly bloccata = signal(false);
  toggle = vi.fn();
}

describe('ComicCard', () => {
  const crea = async (
    impostazioni: { unico?: boolean; edizione?: EditionType | null; inLista?: boolean; bloccata?: boolean } = {},
  ) => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.unico.set(impostazioni.unico ?? false);
    fixture.componentInstance.edizione.set(impostazioni.edizione ?? null);
    fixture.componentInstance.inLista.set(impostazioni.inLista ?? false);
    fixture.componentInstance.bloccata.set(impostazioni.bloccata ?? false);
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

  it('il segnalibro emette bookmarkToggle senza far seguire il link', async () => {
    const { fixture, html } = await crea();
    const evento = new MouseEvent('click', { bubbles: true, cancelable: true });
    (html.querySelector('button') as HTMLButtonElement).dispatchEvent(evento);

    expect(fixture.componentInstance.toggle).toHaveBeenCalledOnce();
    expect(evento.defaultPrevented).toBe(true);
  });

  it('il segnalibro è premuto e usa l’etichetta «rimuovi» quando il fumetto è in lista', async () => {
    const { html } = await crea({ inLista: true });
    const segnalibro = html.querySelector('button') as HTMLButtonElement;
    expect(segnalibro.getAttribute('aria-pressed')).toBe('true');
    expect(segnalibro.getAttribute('aria-label')).toBe('bookmark.remove');
  });

  it('per l’ospite il segnalibro ha il lucchetto, non è premuto e lo dice con aria-disabled', async () => {
    const { html } = await crea({ inLista: true, bloccata: true });
    const segnalibro = html.querySelector('button') as HTMLButtonElement;
    expect(segnalibro.getAttribute('aria-label')).toBe('bookmark.locked');
    expect(segnalibro.getAttribute('aria-pressed')).toBe('false');
    expect(segnalibro.getAttribute('aria-disabled')).toBe('true');
  });

  it('per l’ospite il tocco sul segnalibro emette comunque, così arriva l’invito a iscriversi', async () => {
    const { fixture, html } = await crea({ bloccata: true });
    (html.querySelector('button') as HTMLButtonElement).click();
    expect(fixture.componentInstance.toggle).toHaveBeenCalledOnce();
  });
});

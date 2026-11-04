import { Component } from '@angular/core';
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
      [isSingleVolume]="unico"
      [editionType]="edizione"
      (bookmarkToggle)="toggle()"
    />
  `,
})
class Host {
  unico = false;
  edizione: EditionType | null = null;
  toggle = vi.fn();
}

describe('ComicCard', () => {
  const crea = async (impostazioni: Partial<Host> = {}) => {
    const fixture = TestBed.createComponent(Host);
    Object.assign(fixture.componentInstance, impostazioni);
    await fixture.whenStable();
    return { fixture, html: fixture.nativeElement as HTMLElement };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('mostra titolo e autore, con il titolo che porta alla pagina del fumetto', async () => {
    const { html } = await crea();
    const link = html.querySelector('h3 a') as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Neon Horizon');
    expect(link.getAttribute('href')).toBe('/comic/7');
    expect(html.textContent).toContain('C. Arisato');
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
});

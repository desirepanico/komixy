import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { CatalogItem } from '@shared/models/catalog-item.model';
import { RecentSearchesService } from '../../services/recent-searches/recent-searches.service';
import { DiscoverSearch } from './discover-search';

@Component({
  imports: [DiscoverSearch],
  template: `<app-discover-search
    [query]="query()"
    kind="manga"
    [items]="items"
    [compact]="compact()"
    (searched)="applied.set($event)"
  />`,
})
class Host {
  public readonly items: CatalogItem[] = TestBed.inject(ComicCatalogService)
    .items()
    .filter((item) => item.kind === 'manga' && !item.isAdult);
  public readonly query = signal<string>('');
  public readonly compact = signal<boolean>(false);
  public readonly applied = signal<string | null>(null);
}

describe('DiscoverSearch', () => {
  let fixture: ComponentFixture<Host>;
  let input: HTMLInputElement;

  const root = (): HTMLElement => fixture.nativeElement;
  const type = async (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  const key = async (name: string) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    input = root().querySelector('input')!;
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('il campo è un combobox con nome', () => {
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-label')).toBe('discover.search.label');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('apre i suggerimenti al focus con i più amati', async () => {
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(root().querySelectorAll('[role="option"]').length).toBe(4);
  });

  it('digitando suggerisce i titoli che corrispondono e il testo libero', async () => {
    await type('oda');
    const titles = Array.from(root().querySelectorAll('[role="option"] b')).map((b) =>
      b.textContent?.trim(),
    );
    expect(titles[0]).toBe('One Piece');
    expect(root().querySelectorAll('[role="option"]').length).toBe(2);
  });

  it('con Invio applica il testo e lo ricorda', async () => {
    await type('maus');
    await key('Enter');
    expect(fixture.componentInstance.applied()).toBe('maus');
    expect(TestBed.inject(RecentSearchesService).recent()).toEqual(['maus']);
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('con le frecce sceglie un suggerimento', async () => {
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    await key('ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
    await key('Enter');
    expect(fixture.componentInstance.applied()).toBe(fixture.componentInstance.items[0].title);
  });

  it('con Esc chiude il menu', async () => {
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    await key('Escape');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('il bottone Chiudi compare con il menu aperto', async () => {
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    const close = Array.from(root().querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'discover.search.close',
    );
    close?.click();
    await fixture.whenStable();
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('cancella il testo e lo comunica', async () => {
    await type('maus');
    const clear = root().querySelector<HTMLButtonElement>(
      'button[aria-label="discover.search.clear"]',
    )!;
    clear.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.applied()).toBe('');
    expect(input.value).toBe('');
  });

  it('Ctrl K porta il cursore nel campo', async () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true }),
    );
    await fixture.whenStable();
    expect(document.activeElement).toBe(input);
  });

  it('mostra il suggerimento Ctrl K solo nella versione grande', async () => {
    expect(root().querySelectorAll('kbd').length).toBe(2);
    fixture.componentInstance.compact.set(true);
    await fixture.whenStable();
    expect(root().querySelectorAll('kbd').length).toBe(0);
  });

  it("con un recente scelto, Canc lo toglie dall'elenco", async () => {
    const recents = TestBed.inject(RecentSearchesService);
    recents.add('berserk');
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    await key('ArrowDown');
    await key('Delete');
    expect(recents.recent()).toEqual([]);
  });

  it('mostra le scorciatoie da tastiera solo nella versione grande', async () => {
    input.dispatchEvent(new Event('focus'));
    await fixture.whenStable();
    expect(root().textContent).toContain('discover.search.keys.apply');
    fixture.componentInstance.compact.set(true);
    await fixture.whenStable();
    expect(root().textContent).not.toContain('discover.search.keys.apply');
  });
});

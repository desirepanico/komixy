import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';
import { DiscoverFiltersPanel } from './discover-filters-panel';

@Component({
  imports: [DiscoverFiltersPanel],
  template: `<app-discover-filters-panel
    [(open)]="open"
    [filters]="filters()"
    [items]="items"
    (filtersChange)="filters.set($event)"
  />`,
})
class Host {
  public readonly items = TestBed.inject(ComicCatalogService).items();
  public readonly open = signal<boolean>(false);
  public readonly filters = signal<DiscoverFilters>(EMPTY_FILTERS);
}

describe('DiscoverFiltersPanel', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const root = (): HTMLElement => fixture.nativeElement;
  const pill = (text: string) =>
    Array.from(root().querySelectorAll<HTMLButtonElement>('[role="group"] button')).find((b) =>
      b.textContent?.includes(text),
    )!;

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('è un dialog con titolo', () => {
    const dialog = root().querySelector('dialog')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe('discover-filters-title');
  });

  it('si apre quando `open` è vero', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(root().querySelector('dialog')?.hasAttribute('open')).toBe(true);
  });

  it('per i manga mostra categorie, tema e contenuti per adulti', () => {
    expect(root().textContent).toContain('discover.filters.groups.categories.manga');
    expect(root().textContent).toContain('discover.filters.groups.themes');
    expect(root().querySelector('[role="switch"]')).toBeTruthy();
  });

  it('per i fumetti non ha tema né adulti', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, kind: 'comic' });
    await fixture.whenStable();
    expect(root().textContent).not.toContain('discover.filters.groups.themes');
    expect(root().querySelector('[role="switch"]')).toBeNull();
  });

  it('sceglie e toglie una categoria', async () => {
    pill('discover.options.categories.shonen').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual(['shonen']);
    expect(pill('discover.options.categories.shonen').getAttribute('aria-pressed')).toBe('true');
    pill('discover.options.categories.shonen').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual([]);
  });

  it('il periodo ha una sola scelta', async () => {
    pill('discover.options.era.tens').click();
    await fixture.whenStable();
    pill('discover.options.era.since2020').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().era).toBe('since2020');
  });

  it('accende i contenuti per adulti', async () => {
    root().querySelector<HTMLButtonElement>('[role="switch"]')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().showAdult).toBe(true);
  });

  it('azzera i filtri e tiene la scheda', async () => {
    fixture.componentInstance.filters.set({
      ...EMPTY_FILTERS,
      kind: 'comic',
      categories: ['noir'],
    });
    await fixture.whenStable();
    const reset = Array.from(root().querySelectorAll<HTMLButtonElement>('footer button'))[0];
    reset.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters()).toEqual({ ...EMPTY_FILTERS, kind: 'comic' });
  });

  it('il pulsante in fondo chiude il pannello', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    Array.from(root().querySelectorAll<HTMLButtonElement>('footer button'))[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});

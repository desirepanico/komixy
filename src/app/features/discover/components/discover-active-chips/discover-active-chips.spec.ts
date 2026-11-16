import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';
import { DiscoverActiveChips } from './discover-active-chips';

@Component({
  imports: [DiscoverActiveChips],
  template: `<app-discover-active-chips
    [filters]="filters()"
    (filtersChange)="filters.set($event)"
  />`,
})
class Host {
  public readonly filters = signal<DiscoverFilters>({
    ...EMPTY_FILTERS,
    categories: ['shonen', 'seinen'],
    era: 'tens',
  });
}

describe('DiscoverActiveChips', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const buttons = () =>
    Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mostra un chip per ogni filtro', () => {
    expect(buttons().length).toBe(3);
  });

  it('toglie un solo filtro al tocco', async () => {
    buttons()[0].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual(['seinen']);
  });

  it('toglie il periodo', async () => {
    buttons()[2].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().era).toBe('all');
  });

  it('senza filtri non mostra niente', async () => {
    fixture.componentInstance.filters.set(EMPTY_FILTERS);
    await fixture.whenStable();
    expect(buttons().length).toBe(0);
  });

  it("ogni chip ha l'icona del suo gruppo", () => {
    expect(buttons()[0].querySelector('ng-icon')).not.toBeNull();
  });

  it('il chip dei contenuti per adulti ha il bollino 18+', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, showAdult: true });
    await fixture.whenStable();
    expect(buttons()[0].textContent).toContain('18+');
  });
});

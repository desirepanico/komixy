import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DiscoverChip, DiscoverFilters } from '@shared/models/discover-filters.model';
import { DiscoverChips } from './discover-chips';

const none: DiscoverFilters = {
  kind: 'manga',
  search: '',
  category: [],
  format: [],
  status: [],
  volumes: [],
  theme: [],
  yearFrom: 1960,
  yearTo: 2026,
  adult: false,
};

@Component({
  imports: [DiscoverChips],
  template: `<app-discover-chips [filters]="filters()" (remove)="removed.set($event)" />`,
})
class Host {
  public readonly filters = signal<DiscoverFilters>(none);
  public readonly removed = signal<DiscoverChip | null>(null);
}

describe('DiscoverChips', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;
  const chips = () => Array.from(html.querySelectorAll<HTMLButtonElement>('button'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('senza filtri non mostra nulla', () => {
    expect(html.querySelector('ul')).toBeNull();
  });

  it('mostra un chip per valore, nel gruppo dei filtri applicati', async () => {
    fixture.componentInstance.filters.set({
      ...none,
      category: ['shonen', 'seinen'],
      theme: ['sport'],
    });
    await fixture.whenStable();
    expect(chips()).toHaveLength(3);
    expect(html.querySelector('ul')?.getAttribute('role')).toBe('group');
  });

  it('un tocco su un chip lo segnala per toglierlo', async () => {
    fixture.componentInstance.filters.set({ ...none, status: ['completed'] });
    await fixture.whenStable();
    chips()[0].click();
    expect(fixture.componentInstance.removed()).toEqual({ key: 'status', value: 'completed' });
  });

  it('per i fumetti la sezione delle categorie si chiama genere', async () => {
    fixture.componentInstance.filters.set({ ...none, kind: 'comic', category: ['noir'] });
    await fixture.whenStable();
    expect(chips()[0].getAttribute('aria-label')).toBe('discoverFilters.removeChip');
  });
});

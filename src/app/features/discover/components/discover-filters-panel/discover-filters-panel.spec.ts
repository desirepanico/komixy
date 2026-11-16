import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { DiscoverFiltersPanel, DiscoverToggle } from './discover-filters-panel';

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
  imports: [DiscoverFiltersPanel],
  template: `<app-discover-filters-panel
    [(open)]="open"
    [filters]="filters()"
    [resultCount]="7"
    (valueToggle)="toggled.set($event)"
    (period)="period.set($event)"
    (adultChange)="adult.set($event)"
    (clear)="cleared.set(true)"
  />`,
})
class Host {
  public readonly open = signal<boolean>(true);
  public readonly filters = signal<DiscoverFilters>(none);
  public readonly toggled = signal<DiscoverToggle | null>(null);
  public readonly period = signal<{ from: number; to: number } | null>(null);
  public readonly adult = signal<boolean | null>(null);
  public readonly cleared = signal<boolean>(false);
}

describe('DiscoverFiltersPanel', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;
  const pressed = (label: string) =>
    Array.from(html.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')).find((b) =>
      b.textContent?.includes(label),
    )!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creato', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('per i manga mostra categoria, formato, stato, anno, volumi, tema e adulti', () => {
    const sections = Array.from(
      html.querySelectorAll('section[aria-labelledby^="discover-sec-"] > h3'),
    ).map((h) => h.id);
    expect(sections).toEqual([
      'discover-sec-category',
      'discover-sec-format',
      'discover-sec-status',
      'discover-sec-year',
      'discover-sec-volumes',
      'discover-sec-theme',
    ]);
    expect(html.querySelector('input[role="switch"]')).not.toBeNull();
  });

  it('per i fumetti mostra il genere e niente tema né adulti', async () => {
    fixture.componentInstance.filters.set({ ...none, kind: 'comic' });
    await fixture.whenStable();
    expect(html.textContent).toContain('discoverFilters.sections.genre');
    expect(html.textContent).not.toContain('discoverFilters.sections.theme');
    expect(html.querySelector('input[role="switch"]')).toBeNull();
  });

  it('un valore scelto ha aria-pressed e un clic lo segnala', async () => {
    fixture.componentInstance.filters.set({ ...none, category: ['shonen'] });
    await fixture.whenStable();
    expect(pressed('options.category.shonen').getAttribute('aria-pressed')).toBe('true');
    pressed('options.category.seinen').click();
    expect(fixture.componentInstance.toggled()).toEqual({ key: 'category', value: 'seinen' });
  });

  it('scegliere un periodo segnala l’intervallo', () => {
    pressed('eras.y1990').click();
    expect(fixture.componentInstance.period()).toEqual({ from: 1990, to: 1999 });
  });

  it('senza età verificata l’interruttore degli adulti apre la guida e non attiva il filtro', async () => {
    const toggle = html.querySelector<HTMLInputElement>('input[role="switch"]')!;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.adult()).toBeNull();
    expect(html.querySelector('#discover-guide')?.hasAttribute('inert')).toBe(false);
    expect(toggle.checked).toBe(false);
  });

  it('con l’età verificata l’interruttore degli adulti segnala il nuovo valore', async () => {
    TestBed.inject(AgeVerificationService).check(1, 1, 1990);
    const toggle = html.querySelector<HTMLInputElement>('input[role="switch"]')!;
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.adult()).toBe(true);
  });

  it('«Cancella filtri» segnala il reset e il pulsante finale chiude con il conteggio', async () => {
    const buttons = Array.from(
      html.querySelectorAll<HTMLButtonElement>('button:not([aria-pressed])'),
    );
    buttons.find((b) => b.textContent?.includes('clearFilters'))!.click();
    expect(fixture.componentInstance.cleared()).toBe(true);
    buttons.find((b) => b.textContent?.includes('panel.show'))!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('chiudere il pannello dal pulsante ha un’etichetta', () => {
    expect(html.querySelector('button[aria-label="discoverFilters.panel.close"]')).not.toBeNull();
  });
});

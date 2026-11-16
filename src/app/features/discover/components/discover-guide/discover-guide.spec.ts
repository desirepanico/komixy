import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { DiscoverToggle } from '../discover-filters-panel/discover-filters-panel';
import { DiscoverGuide } from './discover-guide';

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
  imports: [DiscoverGuide],
  template: `<app-discover-guide
    [open]="open()"
    [filters]="filters()"
    [resultCount]="4"
    (back)="backed.set(true)"
    (valueToggle)="toggled.set($event)"
    (adultChange)="adult.set($event)"
    (clear)="cleared.set(true)"
  />`,
})
class Host {
  public readonly open = signal<boolean>(true);
  public readonly filters = signal<DiscoverFilters>(none);
  public readonly backed = signal<boolean>(false);
  public readonly toggled = signal<DiscoverToggle | null>(null);
  public readonly adult = signal<boolean | null>(null);
  public readonly cleared = signal<boolean>(false);
}

describe('DiscoverGuide', () => {
  let fixture: ComponentFixture<Host>;
  let html: HTMLElement;
  const cards = (label: string) =>
    Array.from(html.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')).filter((b) =>
      b.textContent?.includes(label),
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    html = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('chiusa non è raggiungibile (inert)', async () => {
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    expect(html.querySelector('#discover-guide')?.hasAttribute('inert')).toBe(true);
  });

  it('ha una scheda per ogni categoria dei manga e il blocco degli adulti', () => {
    expect(html.querySelectorAll('#discover-guide-category ~ button[aria-pressed]')).toHaveLength(
      5,
    );
    expect(html.querySelector('#discover-guide-adult')).not.toBeNull();
  });

  it('per i fumetti non ci sono il tema né gli adulti', async () => {
    fixture.componentInstance.filters.set({ ...none, kind: 'comic' });
    await fixture.whenStable();
    expect(html.querySelector('#discover-guide-theme')).toBeNull();
    expect(html.querySelector('#discover-guide-adult')).toBeNull();
  });

  it('toccare una scheda segnala il valore, e le schede dei filtri attivi sono premute', async () => {
    fixture.componentInstance.filters.set({ ...none, category: ['seinen'] });
    await fixture.whenStable();
    const seinen = cards('options.category.seinen')[0];
    expect(seinen.getAttribute('aria-pressed')).toBe('true');
    cards('options.category.shonen')[0].click();
    expect(fixture.componentInstance.toggled()).toEqual({ key: 'category', value: 'shonen' });
  });

  it('la freccia riporta ai filtri e «Azzera» è disattivo senza filtri', () => {
    html.querySelector<HTMLButtonElement>('#discover-guide-back')!.click();
    expect(fixture.componentInstance.backed()).toBe(true);
    const reset = Array.from(html.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
      b.textContent?.includes('guide.reset'),
    )!;
    expect(reset.disabled).toBe(true);
  });

  it('la verifica dell’età apre il modulo e un maggiorenne attiva i contenuti per adulti', async () => {
    html.querySelector<HTMLButtonElement>('button[aria-controls="discover-age-form"]')!.click();
    await fixture.whenStable();
    const set = (id: string, value: string) => {
      const input = html.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('discover-age-day', '1');
    set('discover-age-month', '1');
    set('discover-age-year', '1990');
    await fixture.whenStable();
    html.querySelector<HTMLButtonElement>('form button[type="submit"]')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.adult()).toBe(true);
  });

  it('una data nel futuro mostra l’errore e non attiva nulla', async () => {
    html.querySelector<HTMLButtonElement>('button[aria-controls="discover-age-form"]')!.click();
    await fixture.whenStable();
    const set = (id: string, value: string) => {
      const input = html.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('discover-age-day', '1');
    set('discover-age-month', '1');
    set('discover-age-year', '2999');
    await fixture.whenStable();
    html.querySelector<HTMLButtonElement>('form button[type="submit"]')!.click();
    await fixture.whenStable();
    expect(html.querySelector('[role="alert"]')).not.toBeNull();
    expect(fixture.componentInstance.adult()).toBeNull();
  });
});

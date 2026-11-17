import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
import { DiscoverGuide } from './discover-guide';

@Component({
  imports: [DiscoverGuide],
  template: `<app-discover-guide
    [filters]="filters()"
    [askAge]="askAge()"
    (filtersChange)="filters.set($event)"
    (back)="backed.set(backed() + 1)"
    (done)="finished.set(finished() + 1)"
  />`,
})
class Host {
  public readonly filters = signal<DiscoverFilters>(EMPTY_FILTERS);
  public readonly askAge = signal<boolean>(false);
  public readonly backed = signal<number>(0);
  public readonly finished = signal<number>(0);
}

describe('DiscoverGuide', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  const root = (): HTMLElement => fixture.nativeElement;
  const cards = () =>
    Array.from(root().querySelectorAll<HTMLButtonElement>('button[aria-pressed]'));
  const card = (text: string) => cards().find((b) => b.textContent?.includes(text))!;
  const type = async (id: string, value: string) => {
    const input = root().querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  it('viene creata', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('il pulsante in fondo dice «Mostra risultati», senza numero', () => {
    const buttons = Array.from(root().querySelectorAll<HTMLButtonElement>('footer button'));
    expect(buttons.at(-1)?.textContent?.trim()).toBe('discover.filters.show');
  });

  it('per i manga ha categorie, formati, stato, temi e il blocco 18+', () => {
    const text = root().textContent;
    expect(text).toContain('discover.guide.categories');
    expect(text).toContain('discover.guide.sectionThemes');
    expect(text).toContain('discover.guide.adultTitle');
  });

  it('le categorie dei manga hanno il personaggio', () => {
    const avatars = root().querySelectorAll<HTMLImageElement>('img[src^="data:image/svg+xml"]');
    expect(avatars.length).toBe(5);
    expect(avatars[0].getAttribute('alt')).toBe('');
  });

  it('per i fumetti usa i generi e non ha né temi né 18+', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, kind: 'comic' });
    await fixture.whenStable();
    expect(root().textContent).toContain('discover.guide.genres');
    expect(root().textContent).not.toContain('discover.guide.sectionThemes');
    expect(root().textContent).not.toContain('discover.guide.adultTitle');
  });

  it('toccare una scheda accende il filtro e riprovando lo toglie', async () => {
    card('discover.options.categories.shonen').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual(['shonen']);
    expect(card('discover.options.categories.shonen').getAttribute('aria-pressed')).toBe('true');
    card('discover.options.categories.shonen').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual([]);
  });

  it('«Azzera» toglie tutte le scelte', async () => {
    card('discover.options.formats.series').click();
    await fixture.whenStable();
    const reset = Array.from(root().querySelectorAll<HTMLButtonElement>('footer button'))[0];
    reset.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters()).toEqual(EMPTY_FILTERS);
  });

  it('il pulsante indietro e quello dei risultati emettono', async () => {
    root().querySelector<HTMLButtonElement>('header button')?.click();
    Array.from(root().querySelectorAll<HTMLButtonElement>('footer button')).at(-1)?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.backed()).toBe(1);
    expect(fixture.componentInstance.finished()).toBe(1);
  });

  it('«Verifica età» apre il modulo e un maggiorenne accende i contenuti per adulti', async () => {
    root().querySelector<HTMLButtonElement>('button[aria-controls="discover-age-form"]')?.click();
    await fixture.whenStable();
    await type('discover-age-day', '1');
    await type('discover-age-month', '1');
    await type('discover-age-year', '1990');
    root()
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(TestBed.inject(AgeVerificationService).verified()).toBe(true);
    expect(fixture.componentInstance.filters().showAdult).toBe(true);
  });

  it("un minorenne vede l'errore e non accende nulla", async () => {
    root().querySelector<HTMLButtonElement>('button[aria-controls="discover-age-form"]')?.click();
    await fixture.whenStable();
    const year = new Date().getFullYear() - 10;
    await type('discover-age-day', '1');
    await type('discover-age-month', '1');
    await type('discover-age-year', String(year));
    root()
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
    expect(root().querySelector('[role="alert"]')?.textContent).toContain(
      'discover.guide.ageMinor',
    );
    expect(fixture.componentInstance.filters().showAdult).toBe(false);
  });

  it("aprendo dall'interruttore degli adulti il modulo è già aperto", async () => {
    fixture.componentInstance.askAge.set(true);
    await fixture.whenStable();
    expect(root().querySelector('#discover-age-form')).not.toBeNull();
  });

  it("aprendo il modulo dell'età la guida scende fino a lui, dopo l'ingresso", async () => {
    const scroll = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      value: scroll,
      configurable: true,
    });
    fixture.componentInstance.askAge.set(true);
    await fixture.whenStable();
    expect(scroll).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(scroll).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' });
    delete (HTMLElement.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });

  it('i formati hanno la loro illustrazione', () => {
    expect(root().querySelectorAll('app-format-illustration').length).toBe(2);
  });

  it('toccare una scheda la fa rimbalzare finché finisce il movimento', async () => {
    const shonen = card('discover.options.categories.shonen');
    shonen.click();
    await fixture.whenStable();
    expect(shonen.classList).toContain('animate-pop');
    shonen.dispatchEvent(Object.assign(new Event('animationend'), { animationName: 'pop' }));
    await fixture.whenStable();
    expect(shonen.classList).not.toContain('animate-pop');
  });

  it('ogni voce si può scegliere, anche se con gli altri filtri non darebbe titoli', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, era: 'since2020' });
    await fixture.whenStable();
    const kodomo = card('discover.options.categories.kodomo');
    expect(kodomo.disabled).toBe(false);
    kodomo.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual(['kodomo']);
    expect(root().textContent).not.toContain('discover.guide.noResults');
  });

  it('si possono scegliere tutti i valori di tutti i gruppi, uno dopo l’altro', async () => {
    for (const name of cards().map((c) => c.textContent ?? '')) {
      expect(name).not.toBe('');
    }
    expect(cards().every((c) => !c.disabled)).toBe(true);
    for (const button of cards()) {
      button.click();
      await fixture.whenStable();
    }
    expect(cards().every((c) => c.getAttribute('aria-pressed') === 'true')).toBe(true);
  });
});

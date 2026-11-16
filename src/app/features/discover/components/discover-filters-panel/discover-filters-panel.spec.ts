import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { DiscoverFilters, EMPTY_FILTERS } from '../../models/discover-filters.model';
import { AgeVerificationService } from '../../services/age-verification/age-verification.service';
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

  it('passa dai filtri alla guida e torna indietro, con una sola vista alla volta', async () => {
    const guideButton = (): HTMLButtonElement =>
      Array.from(root().querySelectorAll<HTMLButtonElement>('header button')).find((b) =>
        b.textContent?.includes('discover.filters.guide'),
      )!;
    expect(root().querySelector('app-discover-guide')).toBeNull();

    guideButton().click();
    await fixture.whenStable();
    expect(root().querySelector('app-discover-guide')).toBeTruthy();
    expect(root().querySelector('#discover-filters-title')).toBeNull();

    root().querySelector<HTMLButtonElement>('app-discover-guide header button')!.click();
    await fixture.whenStable();
    expect(root().querySelector('app-discover-guide')).toBeNull();
    expect(root().querySelector('#discover-filters-title')).toBeTruthy();
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

  it('accendere gli adulti senza età verificata apre la guida con il modulo', async () => {
    root().querySelector<HTMLButtonElement>('[role="switch"]')?.click();
    await fixture.whenStable();
    expect(root().querySelector('app-discover-guide')).not.toBeNull();
    expect(root().querySelector('#discover-age-form')).not.toBeNull();
    expect(fixture.componentInstance.filters().showAdult).toBe(false);
  });

  it("con l'età verificata accende gli adulti direttamente", async () => {
    TestBed.inject(AgeVerificationService).check(1, 1, 1990);
    root().querySelector<HTMLButtonElement>('[role="switch"]')?.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().showAdult).toBe(true);
  });

  it('«Guida ai filtri» apre la guida e il pulsante indietro torna ai filtri', async () => {
    const guide = Array.from(root().querySelectorAll<HTMLButtonElement>('header button')).find(
      (b) => b.textContent?.includes('discover.filters.guide'),
    )!;
    guide.click();
    await fixture.whenStable();
    expect(root().querySelector('app-discover-guide')).not.toBeNull();
    root().querySelector<HTMLButtonElement>('app-discover-guide header button')?.click();
    await fixture.whenStable();
    expect(root().querySelector('app-discover-guide')).toBeNull();
  });

  it('un tocco sullo sfondo chiude il pannello', async () => {
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    root()
      .querySelector('dialog')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
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

  it('il titolo dice se sono i filtri dei manga o dei fumetti', async () => {
    expect(root().querySelector('#discover-filters-title')?.textContent).toContain(
      'discover.filters.titleManga',
    );
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, kind: 'comic' });
    await fixture.whenStable();
    expect(root().querySelector('#discover-filters-title')?.textContent).toContain(
      'discover.filters.titleComic',
    );
  });

  it("le sezioni stanno nell'ordine: categoria, formato, stato, anno, volumi, tema", () => {
    const titles = Array.from(root().querySelectorAll('section h3')).map((h) => h.id);
    expect(titles).toEqual([
      'discover-group-categories',
      'discover-group-formats',
      'discover-group-statuses',
      'discover-group-era',
      'discover-group-volumes',
      'discover-group-themes',
    ]);
  });

  it('la scheda informativa compare solo con una categoria scelta e si può nascondere', async () => {
    expect(root().querySelector('#discover-info-card')).toBeNull();
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, categories: ['shonen'] });
    await fixture.whenStable();
    expect(root().querySelector('#discover-info-card')).not.toBeNull();
    root().querySelector<HTMLButtonElement>('button[aria-controls="discover-info-card"]')?.click();
    await fixture.whenStable();
    expect(root().querySelector('#discover-info-card')).toBeNull();
  });

  it("la scheda informativa segue l'ultima categoria scelta", async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, categories: ['shonen', 'seinen'] });
    await fixture.whenStable();
    expect(root().querySelector('#discover-info-card')?.textContent).toContain(
      'discover.guide.info.categories.seinen.text',
    );
  });

  it('ogni valore si può scegliere, anche se con gli altri filtri non darebbe titoli', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, era: 'since2020' });
    await fixture.whenStable();
    expect(pill('discover.options.categories.kodomo').disabled).toBe(false);
    pill('discover.options.categories.kodomo').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.filters().categories).toEqual(['kodomo']);
  });

  it('«Cancella filtri» è il bottone condiviso e si spegne senza scelte', async () => {
    const reset = root().querySelector<HTMLButtonElement>('footer button[appButton]')!;
    expect(reset.disabled).toBe(true);
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, formats: ['series'] });
    await fixture.whenStable();
    expect(reset.disabled).toBe(false);
  });

  it("per i fumetti i generi sono schede con icona e non c'è la scheda informativa", async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, kind: 'comic' });
    await fixture.whenStable();
    expect(root().querySelector('#discover-info-card')).toBeNull();
    expect(pill('discover.options.categories.noir').querySelector('ng-icon')).not.toBeNull();
  });

  it('la scheda informativa mostra gli esempi come etichette', async () => {
    fixture.componentInstance.filters.set({ ...EMPTY_FILTERS, categories: ['shonen'] });
    await fixture.whenStable();
    const card = root().querySelector('#discover-info-card')!;
    expect(card.textContent).toContain('discover.guide.info.categories.shonen.example');
  });

  describe('gesto per chiudere il foglio', () => {
    const touch = (type: string, y: number, target: Element) =>
      target.dispatchEvent(
        Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
          touches: [{ clientY: y }],
        }),
      );
    const dialog = () => root().querySelector('dialog')!;
    const header = () => root().querySelector('header')!;

    beforeEach(async () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
      fixture.componentInstance.open.set(true);
      await fixture.whenStable();
    });

    it("trascinando l'intestazione verso il basso il foglio segue il dito", async () => {
      touch('touchstart', 100, header());
      touch('touchmove', 160, header());
      await fixture.whenStable();
      expect(dialog().style.transform).toBe('translateY(60px)');
    });

    it('un trascinamento breve e lento lo riporta a posto', async () => {
      touch('touchstart', 100, header());
      touch('touchmove', 130, header());
      await new Promise((resolve) => setTimeout(resolve, 150));
      touch('touchend', 130, header());
      await fixture.whenStable();
      expect(dialog().style.transform).toBe('');
      expect(fixture.componentInstance.open()).toBe(true);
    });

    it('un trascinamento lungo lo chiude', async () => {
      touch('touchstart', 100, header());
      touch('touchmove', 300, header());
      touch('touchend', 300, header());
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fixture.whenStable();
      expect(fixture.componentInstance.open()).toBe(false);
    });

    it('non parte da una lista scorsa: è uno scorrimento', async () => {
      const list = root().querySelector<HTMLElement>('[data-sheet-scroll]')!;
      list.scrollTop = 40;
      touch('touchstart', 100, list);
      touch('touchmove', 300, list);
      await fixture.whenStable();
      expect(dialog().style.transform).toBe('');
    });

    it('sopra i 768px non fa nulla', async () => {
      vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);
      touch('touchstart', 100, header());
      touch('touchmove', 300, header());
      await fixture.whenStable();
      expect(dialog().style.transform).toBe('');
    });
  });
});

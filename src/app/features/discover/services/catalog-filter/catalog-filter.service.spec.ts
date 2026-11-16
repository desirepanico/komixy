import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ComicCatalogService } from '@shared/services/comic-catalog/comic-catalog.service';
import { EMPTY_FILTERS } from '../../models/discover-filters.model';
import { CatalogFilterService } from './catalog-filter.service';

describe('CatalogFilterService', () => {
  let service: CatalogFilterService;
  const items = () => TestBed.inject(ComicCatalogService).items();

  beforeEach(() => {
    service = TestBed.inject(CatalogFilterService);
  });

  it('mostra solo i titoli della scheda', () => {
    const manga = service.filter(items(), EMPTY_FILTERS);
    expect(manga.length).toBeGreaterThan(0);
    expect(manga.every((item) => item.kind === 'manga')).toBe(true);
  });

  it('nasconde gli adulti dei manga finché non si chiedono', () => {
    expect(service.filter(items(), EMPTY_FILTERS).some((i) => i.isAdult)).toBe(false);
    const withAdult = service.filter(items(), { ...EMPTY_FILTERS, showAdult: true });
    expect(withAdult.some((i) => i.isAdult)).toBe(true);
  });

  it("cerca nel titolo e nell'autore senza badare alle maiuscole", () => {
    expect(service.filter(items(), { ...EMPTY_FILTERS, query: 'ODA' }).map((i) => i.title)).toEqual(
      ['One Piece'],
    );
  });

  it('filtra per categoria', () => {
    const josei = service.filter(items(), { ...EMPTY_FILTERS, categories: ['josei'] });
    expect(josei.map((i) => i.title)).toEqual(['Nana']);
  });

  it('filtra per periodo di uscita', () => {
    const recent = service.filter(items(), { ...EMPTY_FILTERS, era: 'since2020' });
    expect(recent.every((i) => i.year >= 2020)).toBe(true);
  });

  it('dei fumetti ignora il tema e gli adulti', () => {
    expect(service.facetsFor('comic')).not.toContain('themes');
    expect(service.facetsFor('manga')).toContain('showAdult');
  });

  it('conta i titoli di una scelta tenendo gli altri filtri', () => {
    const filters = { ...EMPTY_FILTERS, statuses: ['ongoing' as const] };
    expect(service.count(items(), filters, 'categories', 'shonen')).toBe(
      service.filter(items(), { ...EMPTY_FILTERS, statuses: ['ongoing'], categories: ['shonen'] })
        .length,
    );
  });

  it('conta i gruppi attivi senza contare la ricerca', () => {
    const filters = {
      ...EMPTY_FILTERS,
      query: 'x',
      formats: ['oneShot' as const],
      era: 'tens' as const,
    };
    expect(service.activeCount(filters)).toBe(2);
  });
});

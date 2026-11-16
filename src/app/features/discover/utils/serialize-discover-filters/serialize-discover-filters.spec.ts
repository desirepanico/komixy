import { describe, expect, it } from 'vitest';
import { EMPTY_FILTERS } from '../../models/discover-filters.model';
import { serializeDiscoverFilters } from './serialize-discover-filters';

describe('serializeDiscoverFilters', () => {
  it('con i filtri vuoti non scrive niente', () => {
    expect(Object.values(serializeDiscoverFilters(EMPTY_FILTERS)).every((v) => v === null)).toBe(
      true,
    );
  });

  it('scrive scheda, ricerca e liste', () => {
    expect(
      serializeDiscoverFilters({
        ...EMPTY_FILTERS,
        kind: 'comic',
        query: 'maus',
        categories: ['noir', 'horror'],
        era: 'tens',
      }),
    ).toMatchObject({ tab: 'comic', q: 'maus', cat: 'noir,horror', era: 'tens' });
  });

  it('scrive adult solo se acceso', () => {
    expect(serializeDiscoverFilters({ ...EMPTY_FILTERS, showAdult: true })['adult']).toBe('1');
  });
});

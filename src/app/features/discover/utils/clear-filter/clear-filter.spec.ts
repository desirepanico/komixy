import { describe, expect, it } from 'vitest';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { clearFilter } from './clear-filter';

const filters: DiscoverFilters = {
  kind: 'comic',
  search: 'maus',
  category: ['noir'],
  format: ['omnibus'],
  status: ['completed'],
  volumes: ['single'],
  theme: [],
  yearFrom: 1990,
  yearTo: 1999,
  adult: false,
};

describe('clearFilter', () => {
  it('toglie un elenco di valori e lascia gli altri', () => {
    const cleared = clearFilter(filters, 'category');
    expect(cleared.category).toEqual([]);
    expect(cleared.format).toEqual(['omnibus']);
  });

  it('riporta l’anno all’intervallo intero', () => {
    const cleared = clearFilter(filters, 'year');
    expect([cleared.yearFrom, cleared.yearTo]).toEqual([1960, 2026]);
  });

  it('toglie la ricerca e gli adulti', () => {
    expect(clearFilter(filters, 'search').search).toBe('');
    expect(clearFilter({ ...filters, adult: true }, 'adult').adult).toBe(false);
  });

  it('con all toglie tutto e tiene la sezione', () => {
    const cleared = clearFilter(filters, 'all');
    expect(cleared).toMatchObject({ kind: 'comic', search: '', category: [], volumes: [] });
    expect(cleared.yearFrom).toBe(1960);
  });
});

import { describe, expect, it } from 'vitest';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { toggleFilterValue } from './toggle-filter-value';

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

describe('toggleFilterValue', () => {
  it('aggiunge un valore che non c’è', () => {
    expect(toggleFilterValue(none, 'category', 'shonen').category).toEqual(['shonen']);
  });

  it('toglie un valore che c’è e lascia gli altri', () => {
    const two = toggleFilterValue(toggleFilterValue(none, 'theme', 'sport'), 'theme', 'isekai');
    expect(toggleFilterValue(two, 'theme', 'sport').theme).toEqual(['isekai']);
  });
});

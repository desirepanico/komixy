import { describe, expect, it } from 'vitest';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { discoverChips } from './discover-chips';

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

describe('discoverChips', () => {
  it('senza filtri non ci sono chip', () => {
    expect(discoverChips(none)).toEqual([]);
  });

  it('un chip per valore, con l’anno e gli adulti come chip singoli', () => {
    const chips = discoverChips({
      ...none,
      category: ['shonen', 'seinen'],
      yearFrom: 1990,
      yearTo: 1999,
      theme: ['sport'],
      adult: true,
    });
    expect(chips.map((c) => `${c.key}:${c.value}`)).toEqual([
      'category:shonen',
      'category:seinen',
      'year:year',
      'theme:sport',
      'adult:adult',
    ]);
  });

  it('la ricerca non è un chip', () => {
    expect(discoverChips({ ...none, search: 'one' })).toEqual([]);
  });
});

import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { EMPTY_FILTERS } from '../../models/discover-filters.model';
import { parseDiscoverFilters } from './parse-discover-filters';

describe('parseDiscoverFilters', () => {
  it('senza parametri dà i filtri vuoti', () => {
    expect(parseDiscoverFilters(convertToParamMap({}))).toEqual(EMPTY_FILTERS);
  });

  it('legge scheda, ricerca e liste', () => {
    const filters = parseDiscoverFilters(
      convertToParamMap({ tab: 'comic', q: ' maus ', cat: 'noir,horror', st: 'completed' }),
    );
    expect(filters).toMatchObject({
      kind: 'comic',
      query: 'maus',
      categories: ['horror', 'noir'],
      statuses: ['completed'],
    });
  });

  it("scarta i valori sconosciuti e quelli dell'altra scheda", () => {
    const filters = parseDiscoverFilters(
      convertToParamMap({
        tab: 'comic',
        cat: 'shonen,horror',
        theme: 'sport',
        adult: '1',
        era: 'boh',
      }),
    );
    expect(filters.categories).toEqual(['horror']);
    expect(filters.themes).toEqual([]);
    expect(filters.showAdult).toBe(false);
    expect(filters.era).toBe('all');
  });

  it('una scheda sconosciuta vale manga', () => {
    expect(parseDiscoverFilters(convertToParamMap({ tab: 'x' })).kind).toBe('manga');
  });
});

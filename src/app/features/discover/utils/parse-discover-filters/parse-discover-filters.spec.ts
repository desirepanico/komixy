import { convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { parseDiscoverFilters } from './parse-discover-filters';

describe('parseDiscoverFilters', () => {
  it('senza parametri usa i manga e nessun filtro', () => {
    const filters = parseDiscoverFilters(convertToParamMap({}));
    expect(filters).toMatchObject({
      kind: 'manga',
      search: '',
      category: [],
      yearFrom: 1960,
      yearTo: 2026,
      adult: false,
    });
  });

  it('legge sezione, ricerca e valori ripetuti', () => {
    const filters = parseDiscoverFilters(
      convertToParamMap({
        type: 'comic',
        q: 'maus',
        category: ['noir', 'horror'],
        format: 'omnibus',
      }),
    );
    expect(filters.kind).toBe('comic');
    expect(filters.search).toBe('maus');
    expect(filters.category).toEqual(['noir', 'horror']);
    expect(filters.format).toEqual(['omnibus']);
  });

  it('scarta i valori che non esistono per la sezione e i doppioni', () => {
    const filters = parseDiscoverFilters(
      convertToParamMap({ type: 'comic', category: ['shonen', 'noir', 'noir'], theme: 'isekai' }),
    );
    expect(filters.category).toEqual(['noir']);
    expect(filters.theme).toEqual([]);
  });

  it('un intervallo di anni sbagliato torna a quello intero', () => {
    const filters = parseDiscoverFilters(convertToParamMap({ from: '2010', to: '1990' }));
    expect([filters.yearFrom, filters.yearTo]).toEqual([1960, 2026]);
  });

  it('legge un intervallo di anni valido', () => {
    const filters = parseDiscoverFilters(convertToParamMap({ from: '1990', to: '1999' }));
    expect([filters.yearFrom, filters.yearTo]).toEqual([1990, 1999]);
  });

  it('i contenuti per adulti valgono solo per i manga', () => {
    expect(parseDiscoverFilters(convertToParamMap({ adult: '1' })).adult).toBe(true);
    expect(parseDiscoverFilters(convertToParamMap({ type: 'comic', adult: '1' })).adult).toBe(
      false,
    );
  });
});

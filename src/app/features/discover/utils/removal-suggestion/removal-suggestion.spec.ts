import { describe, expect, it } from 'vitest';
import { CatalogComic } from '@shared/models/comic.model';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { removalSuggestion } from './removal-suggestion';

const comic = (id: string, over: Partial<CatalogComic>): CatalogComic => ({
  id,
  kind: 'manga',
  title: id,
  author: 'Autore',
  volume: 1,
  totalVolumes: 10,
  isSingleVolume: false,
  editionType: null,
  coverUrl: '',
  categories: ['shonen'],
  themes: ['action'],
  format: 'series',
  year: 2000,
  status: 'ongoing',
  adult: false,
  ...over,
});

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

describe('removalSuggestion', () => {
  const catalog = [comic('a', {}), comic('b', {}), comic('c', { status: 'completed' })];

  it('propone il filtro che lascia più volumi', () => {
    const filters = { ...none, category: ['josei'], status: ['completed'] };
    expect(removalSuggestion(catalog, filters)).toEqual({ target: 'category', count: 1 });
  });

  it('propone di togliere la ricerca se è lei a svuotare tutto', () => {
    expect(removalSuggestion(catalog, { ...none, search: 'zzz' })).toEqual({
      target: 'search',
      count: 3,
    });
  });

  it('senza filtri da togliere non propone nulla', () => {
    expect(removalSuggestion([], none)).toBeNull();
  });
});

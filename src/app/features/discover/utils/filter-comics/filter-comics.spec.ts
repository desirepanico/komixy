import { describe, expect, it } from 'vitest';
import { CatalogComic } from '@shared/models/comic.model';
import { DiscoverFilters } from '@shared/models/discover-filters.model';
import { filterComics } from './filter-comics';

const comic = (over: Partial<CatalogComic>): CatalogComic => ({
  id: 'x',
  kind: 'manga',
  title: 'Titolo',
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

const ids = (list: CatalogComic[]) => list.map((c) => c.id);

describe('filterComics', () => {
  const catalog = [
    comic({ id: 'a', title: 'One Piece', author: 'Oda', year: 1997, totalVolumes: 110 }),
    comic({ id: 'b', title: 'Berserk', categories: ['seinen'], adult: true, year: 1989 }),
    comic({
      id: 'c',
      kind: 'comic',
      title: 'Maus',
      categories: ['historical'],
      totalVolumes: null,
    }),
  ];

  it('tiene solo la sezione scelta', () => {
    expect(ids(filterComics(catalog, none))).toEqual(['a']);
    expect(ids(filterComics(catalog, { ...none, kind: 'comic' }))).toEqual(['c']);
  });

  it('mostra i manga per adulti solo se richiesti', () => {
    expect(ids(filterComics(catalog, { ...none, adult: true }))).toEqual(['a', 'b']);
  });

  it('cerca nel titolo e nell’autore senza badare alle maiuscole', () => {
    expect(ids(filterComics(catalog, { ...none, search: 'ODA' }))).toEqual(['a']);
    expect(ids(filterComics(catalog, { ...none, search: 'piece' }))).toEqual(['a']);
    expect(filterComics(catalog, { ...none, search: 'xyz' })).toEqual([]);
  });

  it('più valori della stessa sezione valgono come «o», sezioni diverse come «e»', () => {
    const all = { ...none, adult: true };
    expect(ids(filterComics(catalog, { ...all, category: ['shonen', 'seinen'] }))).toEqual([
      'a',
      'b',
    ]);
    expect(
      ids(filterComics(catalog, { ...all, category: ['seinen'], status: ['completed'] })),
    ).toEqual([]);
  });

  it('filtra per intervallo di anni', () => {
    expect(
      ids(filterComics(catalog, { ...none, adult: true, yearFrom: 1990, yearTo: 1999 })),
    ).toEqual(['a']);
  });

  it('i volumi dei manga si dividono in 1–5, 6–20 e 21+', () => {
    expect(ids(filterComics(catalog, { ...none, volumes: ['v21plus'] }))).toEqual(['a']);
    expect(filterComics(catalog, { ...none, volumes: ['v6to20'] })).toEqual([]);
  });

  it('un fumetto senza totale è un volume unico', () => {
    expect(ids(filterComics(catalog, { ...none, kind: 'comic', volumes: ['single'] }))).toEqual([
      'c',
    ]);
  });

  it('con skip ignora un filtro, con all li ignora tutti', () => {
    const filters = { ...none, search: 'zzz', category: ['josei'] };
    expect(ids(filterComics(catalog, filters, 'search'))).toEqual([]);
    expect(ids(filterComics(catalog, filters, 'all'))).toEqual(['a']);
  });
});

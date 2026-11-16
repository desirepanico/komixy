import { DISCOVER_LIST_KEYS } from '@shared/constants/ui.const';
import { CatalogComic } from '@shared/models/comic.model';
import {
  DiscoverFilterKey,
  DiscoverFilters,
  DiscoverListKey,
} from '@shared/models/discover-filters.model';

/** `skip` ignora un filtro (o la ricerca) per contare cosa resterebbe; `all` li ignora tutti e tiene solo sezione e adulti. */
export type DiscoverSkip = DiscoverFilterKey | 'search' | 'all';

function volumesBucket(comic: CatalogComic): string {
  const total = comic.totalVolumes ?? comic.volume;
  if (comic.kind === 'comic') {
    if (total <= 1) return 'single';
    return total <= 5 ? 'v2to5' : total <= 20 ? 'v6to20' : 'v21plus';
  }
  return total <= 5 ? 'v1to5' : total <= 20 ? 'v6to20' : 'v21plus';
}

function listValues(comic: CatalogComic, key: DiscoverListKey): readonly string[] {
  switch (key) {
    case 'category':
      return comic.categories;
    case 'format':
      return [comic.format];
    case 'status':
      return [comic.status];
    case 'volumes':
      return [volumesBucket(comic)];
    case 'theme':
      return comic.themes;
  }
}

/** Il testo si cerca in titolo e autore, senza maiuscole */
export function filterComics(
  comics: readonly CatalogComic[],
  filters: DiscoverFilters,
  skip?: DiscoverSkip,
): CatalogComic[] {
  const query = filters.search.trim().toLowerCase();
  const skips = (key: DiscoverSkip): boolean => skip === 'all' || skip === key;

  return comics.filter((comic) => {
    if (comic.kind !== filters.kind) return false;
    if (comic.kind === 'manga' && comic.adult && !filters.adult) return false;
    if (
      !skips('search') &&
      query &&
      !`${comic.title} ${comic.author}`.toLowerCase().includes(query)
    )
      return false;
    if (!skips('year') && (comic.year < filters.yearFrom || comic.year > filters.yearTo))
      return false;
    return DISCOVER_LIST_KEYS.every((key) => {
      const selected = filters[key];
      return (
        skips(key) ||
        selected.length === 0 ||
        listValues(comic, key).some((v) => selected.includes(v))
      );
    });
  });
}
